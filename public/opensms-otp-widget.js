(function () {
  const TAG_NAME = "opensms-otp-widget";
  const EVENT_SENT = "opensms:otp-sent";
  const EVENT_VERIFIED = "opensms:otp-verified";
  const EVENT_ERROR = "opensms:otp-error";
  const scriptSrc = document.currentScript && document.currentScript.src ? document.currentScript.src : "";
  const OPEN_SMS_LOGO_URL = scriptSrc ? new URL("favicon.svg", scriptSrc).toString() : "/favicon.svg";
  const OPEN_SMS_BRAND_URL = scriptSrc ? new URL("opensms-brand.svg", scriptSrc).toString() : "/opensms-brand.svg";

  if (customElements.get(TAG_NAME)) return;

  function normalizeResponse(payload) {
    if (!payload || typeof payload !== "object") return {};
    if (payload.data && typeof payload.data === "object") {
      const data = payload.data;
      return {
        ...payload,
        ...data,
        otp_id: payload.otp_id || data.otp_id || data.otp?.id,
        expires_at: payload.expires_at || data.expires_at || data.otp?.expires_at,
        status: payload.status || data.status || data.otp?.status,
        verified_at: payload.verified_at || data.verified_at || data.otp?.verified_at,
      };
    }
    return payload;
  }

  function safeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function isValidPhone(value) {
    return /^[+0-9][0-9\s().-]{6,24}$/.test(String(value || "").trim());
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeColor(value) {
    const color = String(value || "").trim();
    if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(color)) return color;
    if (/^(rgb|hsl)a?\([\d\s,%.+-]+\)$/.test(color)) return color;
    return "#24AEE4";
  }

  class OpenSmsOtpWidget extends HTMLElement {
    static get observedAttributes() {
      return [
        "start-url",
        "verify-url",
        "brand",
        "purpose",
        "phone",
        "logo-url",
        "accent-color",
        "environment",
        "resend-seconds",
      ];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.state = {
        loading: false,
        sent: false,
        verified: false,
        phone: "",
        code: "",
        otpId: "",
        expiresAt: "",
        cooldown: 0,
        error: "",
        message: "",
      };
      this.timer = null;
    }

    connectedCallback() {
      this.syncPhoneFromAttr();
      this.render();
    }

    disconnectedCallback() {
      this.stopTimer();
    }

    attributeChangedCallback() {
      if (!this.shadowRoot) return;
      this.syncPhoneFromAttr();
      this.render();
    }

    get config() {
      return {
        startUrl: this.getAttribute("start-url") || "",
        verifyUrl: this.getAttribute("verify-url") || "",
        brand: this.getAttribute("brand") || "OpenSMS",
        purpose: this.getAttribute("purpose") || "verification",
        phone: this.getAttribute("phone") || "",
        logoUrl: this.getAttribute("logo-url") || "",
        accentColor: this.getAttribute("accent-color") || "#24AEE4",
        environment: this.getAttribute("environment") || "live",
        resendSeconds: safeNumber(this.getAttribute("resend-seconds"), 60),
      };
    }

    syncPhoneFromAttr() {
      const phone = this.getAttribute("phone");
      if (phone && !this.state.phone) this.state.phone = phone;
    }

    emit(name, detail) {
      this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    }

    fail(message, detail) {
      this.state.error = message;
      this.state.message = "";
      this.emit(EVENT_ERROR, { message, ...detail });
      this.render();
    }

    startTimer(seconds) {
      this.stopTimer();
      this.state.cooldown = seconds;
      this.timer = window.setInterval(() => {
        this.state.cooldown = Math.max(0, this.state.cooldown - 1);
        if (this.state.cooldown <= 0) this.stopTimer();
        this.render();
      }, 1000);
    }

    stopTimer() {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
    }

    async sendOtp() {
      const config = this.config;
      const phone = this.state.phone.trim();

      if (!config.startUrl) {
        this.fail("Missing start-url.");
        return;
      }
      if (!isValidPhone(phone)) {
        this.fail("Enter a valid phone number.");
        return;
      }

      this.state.loading = true;
      this.state.error = "";
      this.state.message = "";
      this.render();

      try {
        const response = await fetch(config.startUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            phone,
            purpose: config.purpose,
            environment: config.environment,
          }),
        });
        const payload = normalizeResponse(await response.json().catch(() => ({})));
        if (!response.ok) throw new Error(payload.message || "OTP request failed.");
        const otpId = payload.otp_id || payload.id;
        if (!otpId) throw new Error("OTP response did not include otp_id.");

        this.state.sent = true;
        this.state.verified = false;
        this.state.otpId = otpId;
        this.state.expiresAt = payload.expires_at || "";
        this.state.code = "";
        this.state.message = "Code sent. Check the recipient phone.";
        this.startTimer(config.resendSeconds);
        this.emit(EVENT_SENT, {
          otp_id: otpId,
          expires_at: this.state.expiresAt,
          phone,
          environment: config.environment,
        });
      } catch (error) {
        this.fail(error instanceof Error ? error.message : "OTP request failed.", {
          stage: "start",
          phone,
          environment: config.environment,
        });
      } finally {
        this.state.loading = false;
        this.render();
      }
    }

    async verifyOtp() {
      const config = this.config;
      const code = this.state.code.trim();

      if (!config.verifyUrl) {
        this.fail("Missing verify-url.");
        return;
      }
      if (!this.state.otpId) {
        this.fail("Request a code first.");
        return;
      }
      if (!/^[0-9]{6}$/.test(code)) {
        this.fail("Enter the 6-digit code.");
        return;
      }

      this.state.loading = true;
      this.state.error = "";
      this.state.message = "";
      this.render();

      try {
        const response = await fetch(config.verifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            otp_id: this.state.otpId,
            code,
            environment: config.environment,
          }),
        });
        const payload = normalizeResponse(await response.json().catch(() => ({})));
        if (!response.ok) throw new Error(payload.message || "OTP verification failed.");

        const status = String(payload.status || "").toLowerCase();
        if (status === "verified" || payload.verified === true) {
          this.state.verified = true;
          this.state.message = "Phone number verified.";
          this.stopTimer();
          this.emit(EVENT_VERIFIED, {
            otp_id: this.state.otpId,
            verified_at: payload.verified_at || new Date().toISOString(),
            environment: config.environment,
          });
        } else if (status === "expired") {
          this.fail("This code has expired. Request a new code.", { stage: "verify", status });
        } else if (status === "failed" || status === "max_attempts") {
          this.fail("Too many attempts. Request a new code.", { stage: "verify", status });
        } else {
          this.fail(payload.message || "Incorrect code. Try again.", { stage: "verify", status });
        }
      } catch (error) {
        this.fail(error instanceof Error ? error.message : "OTP verification failed.", {
          stage: "verify",
          environment: config.environment,
        });
      } finally {
        this.state.loading = false;
        this.render();
      }
    }

    changeNumber() {
      this.stopTimer();
      this.state.sent = false;
      this.state.verified = false;
      this.state.code = "";
      this.state.otpId = "";
      this.state.expiresAt = "";
      this.state.cooldown = 0;
      this.state.error = "";
      this.state.message = "";
      this.render();
    }

    setCodeDigit(index, value) {
      const digits = this.state.code.padEnd(6, " ").split("");
      digits[index] = value.replace(/\D/g, "").slice(-1) || " ";
      this.state.code = digits.join("").replace(/\s/g, "").slice(0, 6);
    }

    render() {
      const config = this.config;
      const state = this.state;
      const phoneLocked = Boolean(config.phone);
      const accent = safeColor(config.accentColor);
      const canResend = state.sent && !state.loading && state.cooldown <= 0;
      const activeElement = this.shadowRoot.activeElement;
      const activeDigit = activeElement?.getAttribute("data-digit");
      const activeKey = activeDigit != null
        ? `digit-${activeDigit}`
        : activeElement?.hasAttribute("data-phone")
          ? "phone"
          : "";
      const displayLogoUrl = config.logoUrl || OPEN_SMS_LOGO_URL;
      const title = state.verified ? "Verification Complete" : state.sent ? "Account Verification" : "OTP Verification";
      const subtitle = state.verified
        ? "Your phone number is now confirmed"
        : state.sent
          ? "Enter Verify Code Below"
          : "Enter Your Phone Number";
      const digits = Array.from({ length: 6 }, (_, index) => state.code[index] || "");

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            color: #202124;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            --opensms-accent: ${accent};
          }
          * { box-sizing: border-box; }
          .card {
            width: min(100%, 390px);
            border-radius: 26px;
            background: #ffffff;
            box-shadow: 0 22px 42px rgba(35, 63, 76, 0.16);
            padding: 30px 32px 28px;
            text-align: center;
          }
          .visual {
            display: grid;
            place-items: center;
            height: 116px;
            margin-bottom: 2px;
          }
          .mark {
            display: grid;
            place-items: center;
            width: 86px;
            height: 86px;
            border-radius: 24px;
            background: linear-gradient(145deg, color-mix(in srgb, var(--opensms-accent) 20%, #ffffff), #ffffff);
            box-shadow: inset 0 0 0 1px rgba(32, 33, 36, 0.06), 0 14px 30px rgba(36, 174, 228, 0.18);
            color: var(--opensms-accent);
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 0;
            overflow: hidden;
          }
          .mark img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 14px;
          }
          .phone-visual {
            position: relative;
            width: 86px;
            height: 104px;
            border-radius: 12px;
            border: 6px solid #2E3035;
            background: linear-gradient(145deg, #E8F5FB, #ffffff);
            box-shadow: 0 12px 24px rgba(35, 63, 76, 0.12);
          }
          .phone-visual::before {
            content: "";
            position: absolute;
            left: 28px;
            right: 28px;
            bottom: 7px;
            height: 7px;
            border-radius: 999px;
            background: #AAB3BD;
          }
          .code-bubble {
            position: absolute;
            top: 26px;
            left: 37px;
            min-width: 92px;
            border-radius: 999px;
            background: var(--opensms-accent);
            color: white;
            box-shadow: 0 10px 20px color-mix(in srgb, var(--opensms-accent) 28%, transparent);
            padding: 7px 12px;
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
          }
          h2 {
            margin: 0;
            color: #202124;
            font-size: 25px;
            line-height: 1.08;
            font-weight: 900;
            letter-spacing: 0;
          }
          .subtitle {
            margin: 10px 0 22px;
            color: #35383D;
            font-size: 12px;
            line-height: 1.4;
            font-weight: 500;
          }
          .phone-field {
            display: grid;
            grid-template-columns: 112px minmax(0, 1fr);
            align-items: center;
            min-height: 58px;
            border-radius: 7px;
            background: #E9EEF6;
            box-shadow: inset 0 0 0 1px rgba(32, 33, 36, 0.03);
            overflow: hidden;
          }
          .country {
            display: flex;
            align-items: center;
            gap: 10px;
            height: 100%;
            padding-left: 16px;
            border-right: 1px solid rgba(32, 33, 36, 0.08);
            color: #202124;
            font-size: 15px;
            font-weight: 800;
          }
          .country-code {
            display: inline-grid;
            place-items: center;
            width: 38px;
            height: 30px;
            border-radius: 999px;
            background: #ffffff;
            color: #202124;
            box-shadow: inset 0 0 0 1px rgba(32, 33, 36, 0.08);
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.04em;
          }
          input {
            appearance: none;
            border: 0;
            outline: none;
            background: transparent;
            color: #202124;
            font: inherit;
          }
          .phone-input {
            width: 100%;
            padding: 0 18px;
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .phone-input::placeholder {
            color: #798390;
            font-weight: 600;
          }
          .otp-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 11px;
            margin-bottom: 22px;
          }
          .digit {
            width: 100%;
            aspect-ratio: 0.78;
            border-radius: 7px;
            border: 1px solid transparent;
            background: #E9EEF6;
            color: #202124;
            font-size: 26px;
            font-weight: 800;
            text-align: center;
            box-shadow: inset 0 0 0 1px rgba(32, 33, 36, 0.02);
          }
          .digit:focus {
            border-color: color-mix(in srgb, var(--opensms-accent) 68%, #ffffff);
            background: #ffffff;
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--opensms-accent) 18%, transparent), 0 10px 18px rgba(35, 63, 76, 0.1);
          }
          button {
            appearance: none;
            border: 0;
            cursor: pointer;
            font: inherit;
            transition: transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease;
          }
          button:disabled {
            cursor: not-allowed;
            opacity: 0.62;
          }
          button:not(:disabled):hover {
            transform: translateY(-1px);
          }
          .primary {
            width: 100%;
            min-height: 44px;
            margin-top: 18px;
            border-radius: 7px;
            background: var(--opensms-accent);
            color: white;
            font-size: 13px;
            font-weight: 900;
            box-shadow: 0 11px 22px color-mix(in srgb, var(--opensms-accent) 24%, transparent);
          }
          .sent .primary {
            margin-top: 0;
          }
          .link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 16px;
            min-height: 24px;
            background: transparent;
            color: #4C4F55;
            font-size: 12px;
            font-weight: 500;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .notice {
            margin-top: 14px;
            border-radius: 12px;
            padding: 10px 12px;
            font-size: 12px;
            line-height: 1.45;
            text-align: left;
          }
          .success {
            color: #166534;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
          }
          .error {
            color: #B42318;
            background: rgba(244, 63, 94, 0.08);
            border: 1px solid rgba(244, 63, 94, 0.18);
          }
          .verified-card {
            display: grid;
            gap: 12px;
            justify-items: center;
            padding: 10px 0 4px;
          }
          .verified-badge {
            display: grid;
            place-items: center;
            width: 70px;
            height: 70px;
            border-radius: 999px;
            background: #7DCB35;
            color: white;
            font-size: 34px;
            font-weight: 900;
            box-shadow: 0 14px 24px rgba(125, 203, 53, 0.24);
          }
          .screen-reader {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          .powered {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            margin-top: 18px;
            color: #7A8491;
            font-size: 11px;
            font-weight: 700;
          }
          .powered img {
            width: 86px;
            height: 22px;
            object-fit: contain;
            display: block;
          }
          @media (max-width: 420px) {
            .card {
              padding: 26px 20px 24px;
              border-radius: 22px;
            }
            .phone-field {
              grid-template-columns: 96px minmax(0, 1fr);
            }
            .country {
              padding-left: 12px;
              gap: 7px;
            }
            .country-code {
              width: 34px;
              height: 28px;
            }
            .otp-grid {
              gap: 7px;
            }
            .digit {
              font-size: 22px;
            }
          }
        </style>
        <div class="card ${state.sent ? "sent" : ""}">
          <div class="visual">
            ${state.sent && !state.verified ? `
              <div class="phone-visual" aria-hidden="true">
                <span class="code-bubble">******</span>
              </div>
            ` : `
              <div class="mark" aria-hidden="true">
                <img src="${escapeHtml(displayLogoUrl)}" alt="">
              </div>
            `}
          </div>
          <h2>${escapeHtml(title)}</h2>
          <p class="subtitle">${escapeHtml(subtitle)}</p>

          ${state.verified ? `
            <div class="verified-card">
              <div class="verified-badge" aria-hidden="true">&#10003;</div>
              <button class="link" data-change type="button">Verify another number</button>
            </div>
          ` : !state.sent ? `
            <label class="screen-reader" for="opensms-phone">Phone number</label>
            <div class="phone-field">
              <div class="country" aria-hidden="true">
                <span class="country-code">PH</span>
                <span>PH</span>
              </div>
              <input id="opensms-phone" class="phone-input" type="tel" data-phone value="${escapeHtml(state.phone)}" placeholder="0917 123 4567" ${phoneLocked ? "readonly" : ""}>
            </div>
            <button class="primary" data-send type="button" ${state.loading ? "disabled" : ""}>${state.loading ? "Sending..." : "Send Code"}</button>
            ${phoneLocked ? "" : `<button class="link" data-change type="button">Change Number</button>`}
          ` : `
            <label class="screen-reader">Verification code</label>
            <div class="otp-grid">
              ${digits.map((digit, index) => `<input class="digit" data-digit="${index}" inputmode="numeric" autocomplete="${index === 0 ? "one-time-code" : "off"}" maxlength="1" value="${escapeHtml(digit)}" aria-label="Digit ${index + 1}">`).join("")}
            </div>
            <button class="primary" data-verify type="button" ${state.loading ? "disabled" : ""}>${state.loading ? "Checking..." : "Verify Code"}</button>
            <button class="link" data-resend type="button" ${canResend ? "" : "disabled"}>${state.cooldown > 0 ? "Resend Code in " + state.cooldown + "s" : "Resend Code"}</button>
            <button class="link" data-change type="button">Change Number</button>
          `}

          ${state.error ? `<div class="notice error">${escapeHtml(state.error)}</div>` : ""}
          ${state.message ? `<div class="notice success">${escapeHtml(state.message)}</div>` : ""}
          <div class="powered" aria-label="Powered by OpenSMS">
            <span>Powered by</span>
            <img src="${escapeHtml(OPEN_SMS_BRAND_URL)}" alt="OpenSMS">
          </div>
        </div>
      `;

      const phoneInput = this.shadowRoot.querySelector("[data-phone]");
      const digitInputs = Array.from(this.shadowRoot.querySelectorAll("[data-digit]"));
      const sendButton = this.shadowRoot.querySelector("[data-send]");
      const verifyButton = this.shadowRoot.querySelector("[data-verify]");
      const resendButton = this.shadowRoot.querySelector("[data-resend]");
      const changeButtons = Array.from(this.shadowRoot.querySelectorAll("[data-change]"));

      if (phoneInput) {
        phoneInput.addEventListener("input", (event) => {
          this.state.phone = event.target.value;
        });
        phoneInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") this.sendOtp();
        });
      }

      digitInputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
          const value = event.target.value.replace(/\D/g, "").slice(-1);
          event.target.value = value;
          this.setCodeDigit(index, value);
          this.state.error = "";
          if (value && digitInputs[index + 1]) digitInputs[index + 1].focus();
          if (this.state.code.length === 6) this.render();
        });
        input.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" && !event.target.value && digitInputs[index - 1]) {
            digitInputs[index - 1].focus();
          }
          if (event.key === "Enter") this.verifyOtp();
        });
        input.addEventListener("paste", (event) => {
          event.preventDefault();
          const pasted = (event.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
          this.state.code = pasted;
          this.render();
        });
      });

      if (sendButton) sendButton.addEventListener("click", () => this.sendOtp());
      if (verifyButton) verifyButton.addEventListener("click", () => this.verifyOtp());
      if (resendButton) resendButton.addEventListener("click", () => this.sendOtp());
      changeButtons.forEach((button) => button.addEventListener("click", () => this.changeNumber()));

      if (activeKey) {
        const nextActive = activeKey.startsWith("digit-")
          ? this.shadowRoot.querySelector(`[data-digit="${activeKey.replace("digit-", "")}"]`)
          : this.shadowRoot.querySelector("[data-phone]");
        if (nextActive) {
          nextActive.focus();
          const end = nextActive.value.length;
          if (typeof nextActive.setSelectionRange === "function") nextActive.setSelectionRange(end, end);
        }
      }
    }
  }

  customElements.define(TAG_NAME, OpenSmsOtpWidget);
})();
