import { Button } from "@/components/ui/button";
import "@/index.css";
import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { ServerCogIcon } from "lucide-react";
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

export const Route = createRootRoute<MyRouterContext>({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main className="flex h-screen overflow-hidden">
        <div className="w-60 shrink-0 border-r">
          <nav className="flex flex-col gap-y-1 px-4 py-6">
            <Button
              asChild
              variant="ghost"
              className="group justify-start text-left text-gray-11 data-[active=true]:bg-gray-4 data-[active=true]:text-gray-12"
            >
              <Link
                to="/"
                data-active={false}
                activeProps={{ "data-active": true }}
              >
                <ServerCogIcon className="group-data-[active=true]:text-blue-9" />
                Runners
              </Link>
            </Button>
          </nav>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="h-12 shrink-0 border-b"></div>
          <div className="flex-1 overflow-auto px-12 py-6">
            <Outlet />
          </div>
        </div>
      </main>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" />
    </>
  );
}
