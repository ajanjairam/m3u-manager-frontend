import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Provider({
  children,
}: {
  children: React.JSX.Element[];
}) {
  return (
    <>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </>
  );
}
