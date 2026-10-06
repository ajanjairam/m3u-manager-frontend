import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export const queryClient = new QueryClient();

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
