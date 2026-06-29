import { ArrowLeft } from "lucide-react";
import { OpenSMSLogo } from "./components/OpenSMSLogo";

type LegalKind = "privacy" | "terms";

type LegalSection = {
  title: string;
  body: string[];
};

const updatedAt = "June 30, 2026";
const supportEmail = "support@opensms.cloud";
const privacyEmail = "privacy@opensms.cloud";
const legalEmail = "legal@opensms.cloud";

const privacySections: LegalSection[] = [
  {
    title: "1. Introduction",
    body: [
      "OpenSMS (“OpenSMS”, “we”, “our”, or “us”) provides software and services that let you turn Android phones into SMS gateways and expose a unified messaging API for OTP, transactional, and general SMS traffic.",
      "This Privacy Policy explains how we collect, use, disclose, store, and protect information when you access or use our website, dashboard, REST API, CLI tools, Android gateway application, webhooks, documentation, and related services (collectively, the “Services”).",
      "By creating an account, generating API keys, pairing a gateway, or otherwise using the Services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree, do not use the Services.",
    ],
  },
  {
    title: "2. Scope, deployment models, and roles",
    body: [
      "OpenSMS may be used in different deployment models. Depending on how you use the product, different parties may hold or process data:",
      "Hosted Services: When you use the OpenSMS website, dashboard, or cloud-hosted API endpoints we operate, we generally act as a data controller for account, authentication, billing, and platform usage data, and as a data processor for SMS content and recipient data that you transmit through the Services on behalf of your own customers or end users.",
      "Self-hosted deployments: When you deploy OpenSMS on infrastructure you control, you are typically the data controller for all information processed in that environment. We may still process limited account or support information if you interact with our website, sign in, or contact us, but message content, recipient numbers, and gateway telemetry in your self-hosted stack remain under your control and your policies apply to that deployment.",
      "You remain responsible for determining the lawful basis for processing recipient data, obtaining required consents, honoring opt-out requests, and complying with applicable privacy, telecommunications, and consumer protection laws in every jurisdiction where you send messages, including the Philippines.",
    ],
  },
  {
    title: "3. Information we collect",
    body: [
      "Account and identity information: Name, email address, authentication provider profile (for example, when you sign in with Google), organization name, account settings, and support contact details. Authentication credentials such as passwords are handled through our identity provider and stored in hashed or tokenized form; we do not store plaintext passwords.",
      "Credentials and access controls: API keys, gateway registration tokens, key names, prefixes, revocation status, last-used timestamps, and role or permission assignments associated with your workspace.",
      "Billing information (when applicable): For paid or managed plans, billing contact details, tax information, and limited payment method data processed by a third-party payment provider. We do not store full payment card numbers.",
      "Gateway and device information: Registered Android phone numbers, gateway identifiers, device names, online/offline status, last heartbeat time, battery level, charging state, SIM readiness, carrier or network labels (such as Globe, Smart, TNT, TM, Sun, or DITO where detected), gateway mode (send-only or two-way), and environment association (sandbox or live).",
      "Messaging data: Recipient phone numbers (including normalized Philippine formats such as +63), optional sender identifiers, message bodies when required for routing, logging, delivery confirmation, or support, message IDs, timestamps, routing decisions, delivery states (queued, routed, sent, delivered, failed, inbound), network labels, provider or gateway path metadata, and retry or attempt history.",
      "OTP and transactional records: OTP challenge identifiers, verification status, template identifiers, template content or placeholders where configured, and related audit logs needed to operate OTP and transactional APIs.",
      "Usage and log data: API request metadata, HTTP response codes, authentication events, IP addresses, user agent strings, dashboard activity, error reports, performance metrics, webhook endpoint URLs, webhook delivery attempts, and event payloads such as message.delivered or message.failed where you enable webhooks.",
      "Cookies and similar technologies: Essential cookies and local storage entries needed for session management, authentication state, environment selection, and security. We may use optional analytics technologies to understand product usage; where required by law, we will request consent before using non-essential analytics.",
      "Support communications: Information you choose to provide when contacting us, including message content, screenshots, logs, and troubleshooting details.",
    ],
  },
  {
    title: "4. How we use information",
    body: [
      "We use collected information to provide, operate, maintain, and secure the Services, including routing messages, pairing gateways, exposing APIs, rendering dashboards, and delivering webhooks.",
      "We use account and credential data to authenticate users, manage workspaces, issue and revoke API keys, enforce access controls, and separate sandbox and live environments.",
      "We use messaging and gateway data to queue and route SMS, monitor delivery, display message history, detect failed routes, troubleshoot gateway health, and provide OTP and transactional features you configure.",
      "We use logs and operational metrics to monitor reliability, investigate incidents, prevent abuse, detect fraud or unauthorized access, and improve performance.",
      "We use contact information to respond to support requests, send service announcements, security notices, and policy updates, and to manage billing or contractual communications for paid plans.",
      "We use information as necessary to comply with law, respond to lawful requests, enforce our Terms of Service, and protect the rights, safety, and property of OpenSMS, our users, and others.",
      "We do not sell personal information, recipient phone numbers, or SMS content to third parties for their own marketing purposes.",
    ],
  },
  {
    title: "5. Legal bases for processing",
    body: [
      "Where data protection laws apply, including the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules, we rely on one or more of the following legal bases:",
      "Performance of a contract: Processing necessary to provide the Services you request, manage your account, route messages, and support integrations you configure.",
      "Legitimate interests: Processing reasonably necessary for security, fraud prevention, service improvement, internal analytics, and protection of our platform and users, balanced against your rights and expectations.",
      "Consent: Where required for optional analytics, marketing communications, or certain processing activities, we will ask for consent and allow withdrawal where applicable.",
      "Legal obligation: Processing necessary to comply with applicable laws, regulations, court orders, or lawful requests from public authorities.",
      "When you act as controller for your end users’ data, you must ensure that you have an appropriate legal basis before sending messages or sharing recipient information with OpenSMS.",
    ],
  },
  {
    title: "6. How we share information",
    body: [
      "Service providers: We use trusted third parties to help operate the Services, such as cloud hosting providers, authentication services (including Firebase and Google Cloud), email delivery, payment processors, logging or monitoring tools, and customer support systems. These providers may process information on our behalf under contractual confidentiality and data protection obligations.",
      "Integrations you configure: When you set up webhooks, export data, or connect third-party systems, information is shared at your direction to the endpoints and services you specify. You are responsible for the privacy and security practices of those destinations.",
      "Affiliates and professional advisers: We may share information with affiliated entities or advisers such as lawyers, accountants, or insurers where reasonably necessary for business operations, financing, or compliance.",
      "Legal and safety disclosures: We may disclose information if we believe in good faith that disclosure is necessary to comply with law, respond to valid legal process, protect the safety of any person, address fraud or security issues, or protect OpenSMS’s rights and property.",
      "Business transfers: If OpenSMS is involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be transferred as part of that transaction subject to continued protection consistent with this Privacy Policy.",
      "We do not share recipient phone numbers or message content with third parties for their independent marketing use.",
    ],
  },
  {
    title: "7. Data retention",
    body: [
      "We retain information for as long as reasonably necessary to provide the Services, maintain security, resolve disputes, enforce agreements, and meet legal, tax, accounting, or regulatory requirements.",
      "Account information is generally retained while your account is active and for a limited period afterward unless deletion is requested and permitted by law.",
      "Message metadata, delivery logs, and webhook history may be retained for a limited operational window so you can audit routing, investigate delivery failures, and reconcile billing or support issues. Retention periods may vary by environment, plan, or configuration.",
      "Security, authentication, and abuse-prevention logs may be retained for a longer period where necessary to protect the platform.",
      "In self-hosted deployments, retention is primarily controlled by your configuration and infrastructure policies.",
      "You may request deletion of certain account-related information where feasible and permitted by law. Deletion requests may be limited where we must retain data for legal compliance, dispute resolution, or legitimate security purposes.",
    ],
  },
  {
    title: "8. International transfers",
    body: [
      "OpenSMS may store or process information on servers located outside your country of residence, including in the Philippines, the United States, or other countries where our service providers operate.",
      "When information is transferred internationally, we implement safeguards designed to protect it in accordance with this Privacy Policy and applicable law. These safeguards may include contractual clauses, provider security commitments, and access controls.",
      "If you deploy OpenSMS yourself, you choose where your self-hosted data resides and are responsible for cross-border transfer compliance for that deployment.",
    ],
  },
  {
    title: "9. Security",
    body: [
      "We implement technical and organizational measures designed to protect information, including encrypted transport (such as HTTPS/TLS for website, dashboard, and API access), authentication controls, API key management, environment separation between sandbox and live workspaces where applicable, access restrictions for production systems, and monitoring of infrastructure and gateway health signals.",
      "No method of transmission or electronic storage is completely secure. We cannot guarantee absolute security. You are responsible for safeguarding your passwords, API keys, gateway tokens, webhook secrets, and physical access to paired Android devices.",
      "You must notify us promptly if you believe your account, credentials, gateway, or integration has been compromised.",
    ],
  },
  {
    title: "10. Your responsibilities when messaging end users",
    body: [
      "When you use OpenSMS to send SMS to your customers, employees, or other recipients, you act as a controller or business responsible for those recipients’ data in many situations. You must:",
      "Obtain all legally required notices and consents before collecting or using phone numbers and before sending OTP, transactional, promotional, or marketing messages.",
      "Provide clear sender identification and accurate message content, especially for authentication codes and account-related notifications.",
      "Honor opt-out, unsubscribe, and do-not-contact requests promptly and maintain suppression lists where required.",
      "Comply with applicable telecommunications, anti-spam, consumer protection, and sector-specific rules in the Philippines and any other relevant jurisdiction, including rules applicable to promotional SMS, OTP authentication messages, and financial or healthcare communications.",
      "Configure gateways, webhooks, and downstream systems securely so recipient data is not exposed to unauthorized parties.",
    ],
  },
  {
    title: "11. Your privacy rights",
    body: [
      "Depending on your location and applicable law, you may have rights regarding personal information we hold about you, which may include:",
      "The right to be informed about our processing activities.",
      "The right to access personal information we maintain about you.",
      "The right to rectify inaccurate or incomplete personal information.",
      "The right to erasure or deletion in certain circumstances.",
      "The right to suspend or restrict processing in certain circumstances.",
      "The right to object to certain processing based on legitimate interests.",
      "The right to data portability, where applicable.",
      "The right to withdraw consent where processing is based on consent, without affecting prior lawful processing.",
      "The right to lodge a complaint with a supervisory authority. In the Philippines, this may include the National Privacy Commission under the Data Privacy Act.",
      "You may update certain account information through the dashboard where available. For other requests, contact us using the details below. We may need to verify your identity before fulfilling a request and may decline requests where an exception applies under law.",
    ],
  },
  {
    title: "12. Children's privacy",
    body: [
      "The Services are intended for organizations and individuals who are at least 18 years old. The Services are not directed to children, and we do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal information, please contact us so we can take appropriate steps to delete it.",
    ],
  },
  {
    title: "13. Changes to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in the Services, legal requirements, or our data practices.",
      "If we make material changes, we will take reasonable steps to notify you, such as posting an updated policy with a revised effective date, displaying a dashboard notice, or sending email where appropriate.",
      "Your continued use of the Services after the effective date of an updated Privacy Policy constitutes acceptance of the revised policy, unless applicable law requires a different form of consent.",
    ],
  },
];

const termsSections: LegalSection[] = [
  {
    title: "1. Agreement to these Terms",
    body: [
      "These Terms of Service (“Terms”) govern your access to and use of OpenSMS websites, dashboards, REST APIs, CLI tools, Android gateway applications, documentation, webhooks, and related services (collectively, the “Services”).",
      "By creating an account, generating API keys, pairing a gateway, or using any part of the Services, you agree to be bound by these Terms and our Privacy Policy.",
      "If you use the Services on behalf of a company, organization, or other entity, you represent and warrant that you have authority to bind that entity, and “you” refers to both you individually and that entity.",
    ],
  },
  {
    title: "2. The Services and license",
    body: [
      "Subject to these Terms, OpenSMS grants you a limited, non-exclusive, non-transferable, revocable right to access and use the Services for your internal business or personal lawful purposes.",
      "The Services may include hosted dashboard and API access, sandbox and live environments, OTP and transactional messaging features, message logs, gateway registration and monitoring, webhook delivery, API key management, and open-source components that you may deploy on your own infrastructure.",
      "Where OpenSMS software is made available under an open-source license, your use of those components is also governed by the applicable open-source license. If there is a conflict between these Terms and an open-source license for a specific component, the open-source license governs your use of that component.",
      "Except for the rights expressly granted in these Terms or in an applicable open-source license, OpenSMS and its licensors reserve all rights in the Services.",
    ],
  },
  {
    title: "3. Accounts, authentication, and security",
    body: [
      "You must provide accurate account information and keep it current. You may authenticate using supported methods such as email and password or third-party sign-in providers.",
      "You are responsible for maintaining the confidentiality of your login credentials, API keys, gateway registration tokens, webhook secrets, and access to paired devices.",
      "You are responsible for all activity occurring under your account or through your credentials, including activity by your employees, contractors, integrations, and automated systems, except to the extent caused by OpenSMS’s material breach of these Terms.",
      "You must notify us promptly if you suspect unauthorized access, credential compromise, or misuse of your account, keys, or gateways.",
    ],
  },
  {
    title: "4. Acceptable use",
    body: [
      "You may use OpenSMS only for lawful purposes and in compliance with these Terms, our documentation, and all applicable laws and regulations.",
      "You must not use the Services to send spam, unsolicited bulk promotional messages, phishing, scams, malware links, unlawful content, deceptive content, or messages that violate carrier policies or telecommunications rules.",
      "You must not use the Services to harass, threaten, or abuse recipients, or to evade opt-out, consent, or sender identification requirements.",
      "You must not interfere with or disrupt the Services, attempt to bypass security controls, probe or scan systems without authorization, overload infrastructure, or access data or accounts that do not belong to you.",
      "You must operate paired Android devices and SIM cards in compliance with applicable carrier terms, device policies, and local law. You must not use gateways in a manner that jeopardizes network integrity or recipient safety.",
      "You must not reverse engineer, decompile, or attempt to extract source code from proprietary portions of the Services except to the extent such restriction is prohibited by applicable law or expressly permitted by an open-source license.",
      "We may investigate usage patterns, monitor logs, and suspend or restrict access if we reasonably believe you have violated these Terms, applicable law, or acceptable messaging practices.",
    ],
  },
  {
    title: "5. Your content, recipients, and data",
    body: [
      "You retain ownership of the content and data you submit to or transmit through the Services, including SMS message bodies, templates, recipient phone numbers, and metadata associated with your applications.",
      "You grant OpenSMS a limited, non-exclusive, worldwide license to host, process, transmit, store, display, and otherwise use your content and data only as necessary to provide, secure, support, and improve the Services, including routing messages, maintaining delivery logs, generating dashboards, delivering webhooks, and troubleshooting incidents.",
      "You represent and warrant that you have all rights, permissions, notices, and consents necessary to collect, use, disclose, and transmit recipient data and message content through the Services, and that your content and use of the Services do not violate any law or infringe any third-party rights.",
      "You are solely responsible for the accuracy of templates, OTP flows, sender labels, recipient lists, and the lawfulness of each message category you send, including OTP, transactional, marketing, and general traffic.",
    ],
  },
  {
    title: "6. Third-party networks, carriers, and dependencies",
    body: [
      "OpenSMS provides infrastructure and tooling. Actual SMS delivery depends on factors outside our exclusive control, including your Android devices, SIM cards, mobile network coverage, handset behavior, recipient availability, and telecommunications networks such as Globe, Smart, TNT, TM, Sun, and DITO in the Philippines.",
      "We do not control carrier acceptance policies, filtering, throttling, or delivery timing. A message marked as sent or routed does not guarantee final receipt by the recipient handset.",
      "You are responsible for compliance with the terms and policies of carriers, SIM providers, device manufacturers, and any third-party services you connect to OpenSMS.",
      "You remain responsible for all carrier charges, SIM fees, data usage, device costs, and third-party service fees associated with your messaging operations.",
    ],
  },
  {
    title: "7. Webhooks and integrations",
    body: [
      "You may configure webhooks and other integrations to receive OpenSMS events such as delivery updates or inbound messages.",
      "You are responsible for securing your receiving endpoints, validating payloads, handling retries and duplicate events, maintaining availability of your systems, and ensuring that data received through integrations is processed in compliance with privacy and security requirements.",
      "OpenSMS is not responsible for failures, delays, or data loss occurring in your downstream systems or third-party services after we deliver an event to a webhook endpoint you control.",
    ],
  },
  {
    title: "8. Plans, fees, and billing",
    body: [
      "OpenSMS may offer a self-host option that allows you to deploy open-source components on infrastructure you control, often without license fees from OpenSMS for the software itself.",
      "OpenSMS may also offer managed, hosted, or commercial plans with additional features such as operational support, routing policies, dashboards, service levels, or priority assistance. Plan details, limits, and pricing are described on our website or in a separate order form or agreement.",
      "For paid plans, you agree to pay all applicable fees according to the billing terms presented at purchase or in your order form. Unless otherwise stated, fees are non-refundable except where required by law or expressly agreed in writing.",
      "You authorize OpenSMS or its payment processor to charge your selected payment method for recurring or usage-based fees where applicable.",
      "Failure to pay applicable fees may result in suspension or termination of paid features.",
      "Even when OpenSMS software is free to self-host, you remain responsible for your own infrastructure costs and all telecommunications charges associated with SMS delivery.",
    ],
  },
  {
    title: "9. Service changes, availability, and support",
    body: [
      "We may modify, update, suspend, or discontinue any part of the Services at any time, including APIs, features, documentation, environments, or pricing structures.",
      "Where a change is material and affects hosted Services, we will use reasonable efforts to provide advance notice through the dashboard, documentation, or email.",
      "We strive to maintain reliable Services and may offer service levels for certain paid plans, but the Services may be unavailable due to maintenance, upgrades, device offline states, network outages, provider failures, or events beyond our reasonable control.",
      "Unless expressly agreed in a separate written SLA, support and uptime commitments are provided on a commercially reasonable basis and may vary by plan.",
    ],
  },
  {
    title: "10. Term and termination",
    body: [
      "These Terms remain in effect while you access or use the Services.",
      "You may stop using the Services at any time and may request account closure through the dashboard or by contacting us.",
      "We may suspend or terminate your access immediately if you breach these Terms, create legal or security risk, fail to pay applicable fees, or if we are required to do so by law or court order.",
      "Upon termination, your right to access the Services ends. We may retain certain logs and account records as described in our Privacy Policy and as required by law.",
      "Provisions that by their nature should survive termination will survive, including ownership provisions, payment obligations, disclaimers, limitations of liability, indemnity, and dispute terms.",
    ],
  },
  {
    title: "11. Disclaimers",
    body: [
      "To the maximum extent permitted by applicable law, the Services are provided on an “as is” and “as available” basis.",
      "OpenSMS disclaims all warranties, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.",
      "We do not warrant that the Services will be uninterrupted, error-free, secure, or that any message will be delivered, delivered within a specific time, or accepted by a carrier or recipient device.",
      "You are responsible for evaluating whether the Services are suitable for your use case, including time-sensitive, legal, medical, financial, or emergency communications.",
    ],
  },
  {
    title: "12. Limitation of liability",
    body: [
      "To the maximum extent permitted by applicable law, OpenSMS will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, goodwill, data, business interruption, carrier charges, or failed message delivery, even if we have been advised of the possibility of such damages.",
      "To the maximum extent permitted by applicable law, OpenSMS’s total aggregate liability arising out of or relating to the Services or these Terms will not exceed the greater of: (a) the amounts paid by you to OpenSMS for the hosted Services giving rise to the claim during the three (3) months immediately before the event; or (b) one hundred United States dollars (USD 100) if you use only free or self-hosted offerings.",
      "Some jurisdictions do not allow certain limitations or exclusions of liability, so some of the above limitations may not apply to you.",
    ],
  },
  {
    title: "13. Indemnification",
    body: [
      "You agree to indemnify, defend, and hold harmless OpenSMS and its officers, directors, employees, contractors, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to:",
      "Your use of the Services;",
      "Your content, recipient lists, templates, and messaging campaigns;",
      "Your violation of these Terms or applicable law;",
      "Your infringement or misappropriation of third-party rights; or",
      "Disputes between you and your recipients, carriers, or customers relating to messages sent through the Services.",
      "OpenSMS may assume exclusive control of the defense of any matter subject to indemnification, and you agree to cooperate with our defense.",
    ],
  },
  {
    title: "14. Governing law and disputes",
    body: [
      "Unless otherwise agreed in a separate written contract, these Terms are governed by the laws of the Republic of the Philippines, without regard to conflict of law principles.",
      "Any dispute arising out of or relating to these Terms or the Services shall be brought exclusively in the courts located in Davao City, Davao Region, Philippines, and you consent to the personal jurisdiction of such courts.",
      "Before filing a formal proceeding, the parties agree to attempt in good faith to resolve disputes through informal negotiation for at least thirty (30) days after written notice of the dispute, except where injunctive relief is necessary to prevent immediate harm.",
    ],
  },
  {
    title: "15. Changes to these Terms",
    body: [
      "We may modify these Terms from time to time. When we do, we will update the effective date at the top of the policy and, where appropriate, provide additional notice through the dashboard or email.",
      "Your continued use of the Services after updated Terms become effective constitutes acceptance of the revised Terms, unless applicable law requires a different form of consent.",
    ],
  },
  {
    title: "16. Miscellaneous",
    body: [
      "Entire agreement: These Terms, together with the Privacy Policy and any applicable order form or written agreement, constitute the entire agreement between you and OpenSMS regarding the Services and supersede prior discussions or understandings on the same subject.",
      "Severability: If any provision of these Terms is held invalid or unenforceable, the remaining provisions will remain in full force and effect.",
      "Assignment: You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, corporate reorganization, or sale of assets.",
      "No waiver: Our failure to enforce any provision is not a waiver of our right to enforce it later.",
      "Force majeure: OpenSMS is not liable for delay or failure caused by events beyond our reasonable control, including network outages, carrier failures, natural disasters, war, labor disputes, or government actions.",
    ],
  },
];

function contentFor(kind: LegalKind) {
  if (kind === "privacy") {
    return {
      eyebrow: "Privacy Policy",
      title: "OpenSMS Privacy Policy",
      intro:
        "This Privacy Policy describes how OpenSMS handles personal information and messaging data when you use our hosted services, pair Android gateways, call our APIs, or interact with our website and dashboard. If you self-host OpenSMS, you remain primarily responsible for data processed in your own environment.",
      sections: privacySections,
      contactEmail: privacyEmail,
      contactLabel: "Privacy inquiries",
    };
  }

  return {
    eyebrow: "Terms of Service",
    title: "OpenSMS Terms of Service",
    intro:
      "These Terms govern your use of OpenSMS, including hosted and self-hosted deployments, dashboard access, API keys, OTP and transactional messaging, webhooks, and Android gateway functionality.",
    sections: termsSections,
    contactEmail: legalEmail,
    contactLabel: "Legal inquiries",
  };
}

export function LegalPage({
  kind,
  onHome,
}: {
  kind: LegalKind;
  onHome: () => void;
}) {
  const content = contentFor(kind);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <button onClick={onHome} className="flex items-center" aria-label="OpenSMS home">
            <OpenSMSLogo />
          </button>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-label transition hover:bg-surface hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[940px] px-5 py-12 sm:px-8 lg:py-16">
        <section className="border-b border-border pb-10">
          <p className="text-[13px] font-semibold text-brand">{content.eyebrow}</p>
          <h1 className="mt-3 font-display text-[42px] font-bold leading-[1.05] tracking-[-0.05em] text-foreground sm:text-[56px]">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-8 text-muted-foreground">{content.intro}</p>
          <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-white p-4 text-[14px] text-muted-foreground sm:grid-cols-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">Last updated</p>
              <p className="mt-1 font-semibold text-foreground">{updatedAt}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">{content.contactLabel}</p>
              <a className="mt-1 block break-all font-semibold text-foreground hover:text-brand" href={`mailto:${content.contactEmail}`}>
                {content.contactEmail}
              </a>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">General support</p>
              <a className="mt-1 block break-all font-semibold text-foreground hover:text-brand" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
            </div>
          </div>
          <p className="mt-5 rounded-2xl border border-warning/25 bg-warning-muted px-4 py-3 text-[13px] leading-6 text-warning-emphasis">
            These documents are provided for informational purposes and do not constitute legal advice. Have a qualified lawyer review them before relying on them in production, especially for regulated messaging use cases.
          </p>
        </section>

        <div className="divide-y divide-border">
          {content.sections.map((section) => (
            <section key={section.title} className="py-9">
              <h2 className="text-[25px] font-bold tracking-[-0.04em] text-foreground">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-[15px] leading-8 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-[24px] border border-border bg-white p-5">
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">Contact us</h2>
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
            Questions about this {kind === "privacy" ? "Privacy Policy" : "Terms of Service"} can be sent to{" "}
            <a className="font-semibold text-brand" href={`mailto:${content.contactEmail}`}>
              {content.contactEmail}
            </a>
            . General support is available at{" "}
            <a className="font-semibold text-brand" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
