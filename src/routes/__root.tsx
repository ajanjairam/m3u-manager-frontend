import * as React from "react";
import Provider from "@/components/providers";
import AppSidebar from "@/components/sidebar";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Provider>
        <AppSidebar />
        <SidebarTrigger />
        <Outlet />
      </Provider>
    </React.Fragment>
  );
}
