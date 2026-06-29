import desktopLogo from "@/assets/desktop_logo.svg";

export function OpenSMSLogo({
  light = false,
  className = "h-[26px] w-auto",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <img
      src={desktopLogo}
      alt="OpenSMS"
      className={className}
      style={light ? { filter: "invert(1) hue-rotate(180deg)" } : undefined}
      draggable={false}
    />
  );
}
