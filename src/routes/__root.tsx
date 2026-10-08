import * as React from "react";
import Provider from "@/src/components/providers";
import AppSidebar from "@/src/components/sidebar";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/src/components/ui/sidebar";

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
