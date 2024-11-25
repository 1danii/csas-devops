import { Button } from "@/components/ui/button";
import "@/index.css";
import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  type LinkComponentProps,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { CloudCogIcon, ServerCogIcon } from "lucide-react";
import * as React from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function NavButton({
  children,
  ...props
}: React.PropsWithChildren<LinkComponentProps>) {
  return (
    <Button
      asChild
      variant="ghost"
      className="group justify-start text-left text-gray-11 data-[active=true]:bg-gray-4 data-[active=true]:text-gray-12"
    >
      <Link
        {...props}
        data-active={false}
        activeProps={{ "data-active": true }}
      >
        {children}
      </Link>
    </Button>
  );
}

function RootComponent() {
  return (
    <>
      <main className="flex h-screen overflow-hidden">
        <div className="w-60 shrink-0 border-r">
          <nav className="flex flex-col gap-y-1 px-4 py-6">
            <NavButton to="/runners">
              <ServerCogIcon className="group-data-[active=true]:text-blue-9" />
              Runners
            </NavButton>
            <NavButton to="/jobs">
              <CloudCogIcon className="group-data-[active=true]:text-blue-9" />
              Jobs
            </NavButton>
          </nav>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="h-12 shrink-0 border-b"></div>
          <div className="flex-1 overflow-auto px-12 py-8">
            <Outlet />
          </div>
        </div>
      </main>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" />
    </>
  );
}
