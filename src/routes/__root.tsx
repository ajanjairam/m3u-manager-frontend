import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Provider from '@/components/providers'
import AppSidebar from '@/components/sidebar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Provider>
        <AppSidebar/>
        <Outlet />
      </Provider>
    </React.Fragment>
  )
}
