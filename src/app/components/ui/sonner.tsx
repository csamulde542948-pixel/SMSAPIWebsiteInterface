import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-border bg-white text-foreground shadow-[0_18px_50px_rgba(15,23,42,0.12)]",
          title: "text-[14px] font-semibold",
          description: "text-[13px] text-muted-foreground",
          success: "border-success/20",
          error: "border-red-200",
        },
      }}
      {...props}
    />
  );
}
