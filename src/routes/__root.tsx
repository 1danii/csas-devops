import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import "@/index.css";
import * as Collapsible from "@radix-ui/react-collapsible";
import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  type LinkComponentProps,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import {
  BotIcon,
  ChartBar,
  ChevronDownIcon,
  CloudCogIcon,
  Layers3Icon,
  ServerCogIcon,
} from "lucide-react";
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
      className="group justify-start text-left text-gray-11 data-[active=true]:bg-blue-a4 data-[active=true]:text-blue-12"
    >
      <Link
        {...props}
        data-active={false}
        activeOptions={{ exact: true }}
        activeProps={{ "data-active": true }}
      >
        {children}
      </Link>
    </Button>
  );
}

function NavButtonCollapsible({
  children,
  links,
  ...props
}: React.ComponentProps<"button"> & {
  links: (LinkComponentProps & { label: string })[];
}) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <Button
          variant="ghost"
          className="group w-full justify-start text-left text-gray-11 data-[active=true]:bg-blue-a4 data-[active=true]:text-blue-12"
          {...props}
        >
          {children}
          <ChevronDownIcon className="ml-auto duration-150 ease-in-out group-data-[state=closed]:-rotate-90" />
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="ml-4 flex flex-col border-l pl-2 data-[state=open]:pt-1">
        {links.map(({ label, ...props }, i) => (
          <NavButton key={i} {...props}>
            {label}
          </NavButton>
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function RootComponent() {
  return (
    <>
      <main className="flex h-screen overflow-hidden">
        <div className="flex w-60 shrink-0 flex-col border-r">
          <div className="flex h-12 items-center px-4 text-xl font-semibold">
            DOPO
          </div>
          <nav className="flex flex-col px-4 py-2">
            <NavButton to="/">
              <Layers3Icon className="group-data-[active=true]:text-blue-9" />
              SAS Directory
            </NavButton>
            <NavButton to="/runners">
              <ServerCogIcon className="group-data-[active=true]:text-blue-9" />
              Runners
            </NavButton>
            <NavButton to="/jobs">
              <CloudCogIcon className="group-data-[active=true]:text-blue-9" />
              Jobs
            </NavButton>
            <NavButton to="/automations">
              <BotIcon className="group-data-[active=true]:text-blue-9" />
              Automations
            </NavButton>
            <NavButtonCollapsible
              links={[
                { label: "Runners", to: "/runners/stats" },
                { label: "Jobs", to: "/jobs/stats" },
              ]}
            >
              <ChartBar /> Metrics
            </NavButtonCollapsible>
          </nav>
          <div className="mt-auto flex h-16 items-center px-4">
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="h-12 shrink-0 border-b"></div>
          <div className="flex-1 overflow-auto bg-gray-1 px-12 py-8">
            <Outlet />
          </div>
        </div>
      </main>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" />
    </>
  );
}
