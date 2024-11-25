/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as SasIndexImport } from './routes/sas/index'
import { Route as RunnersIndexImport } from './routes/runners/index'
import { Route as JobsIndexImport } from './routes/jobs/index'
import { Route as AutomationsIndexImport } from './routes/automations/index'
import { Route as RunnersStatsImport } from './routes/runners/stats'
import { Route as RunnersIdImport } from './routes/runners/$id'
import { Route as JobsIdImport } from './routes/jobs/$id'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SasIndexRoute = SasIndexImport.update({
  id: '/sas/',
  path: '/sas/',
  getParentRoute: () => rootRoute,
} as any)

const RunnersIndexRoute = RunnersIndexImport.update({
  id: '/runners/',
  path: '/runners/',
  getParentRoute: () => rootRoute,
} as any)

const JobsIndexRoute = JobsIndexImport.update({
  id: '/jobs/',
  path: '/jobs/',
  getParentRoute: () => rootRoute,
} as any)

const AutomationsIndexRoute = AutomationsIndexImport.update({
  id: '/automations/',
  path: '/automations/',
  getParentRoute: () => rootRoute,
} as any)

const RunnersStatsRoute = RunnersStatsImport.update({
  id: '/runners/stats',
  path: '/runners/stats',
  getParentRoute: () => rootRoute,
} as any)

const RunnersIdRoute = RunnersIdImport.update({
  id: '/runners/$id',
  path: '/runners/$id',
  getParentRoute: () => rootRoute,
} as any)

const JobsIdRoute = JobsIdImport.update({
  id: '/jobs/$id',
  path: '/jobs/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/jobs/$id': {
      id: '/jobs/$id'
      path: '/jobs/$id'
      fullPath: '/jobs/$id'
      preLoaderRoute: typeof JobsIdImport
      parentRoute: typeof rootRoute
    }
    '/runners/$id': {
      id: '/runners/$id'
      path: '/runners/$id'
      fullPath: '/runners/$id'
      preLoaderRoute: typeof RunnersIdImport
      parentRoute: typeof rootRoute
    }
    '/runners/stats': {
      id: '/runners/stats'
      path: '/runners/stats'
      fullPath: '/runners/stats'
      preLoaderRoute: typeof RunnersStatsImport
      parentRoute: typeof rootRoute
    }
    '/automations/': {
      id: '/automations/'
      path: '/automations'
      fullPath: '/automations'
      preLoaderRoute: typeof AutomationsIndexImport
      parentRoute: typeof rootRoute
    }
    '/jobs/': {
      id: '/jobs/'
      path: '/jobs'
      fullPath: '/jobs'
      preLoaderRoute: typeof JobsIndexImport
      parentRoute: typeof rootRoute
    }
    '/runners/': {
      id: '/runners/'
      path: '/runners'
      fullPath: '/runners'
      preLoaderRoute: typeof RunnersIndexImport
      parentRoute: typeof rootRoute
    }
    '/sas/': {
      id: '/sas/'
      path: '/sas'
      fullPath: '/sas'
      preLoaderRoute: typeof SasIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/jobs/$id': typeof JobsIdRoute
  '/runners/$id': typeof RunnersIdRoute
  '/runners/stats': typeof RunnersStatsRoute
  '/automations': typeof AutomationsIndexRoute
  '/jobs': typeof JobsIndexRoute
  '/runners': typeof RunnersIndexRoute
  '/sas': typeof SasIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/jobs/$id': typeof JobsIdRoute
  '/runners/$id': typeof RunnersIdRoute
  '/runners/stats': typeof RunnersStatsRoute
  '/automations': typeof AutomationsIndexRoute
  '/jobs': typeof JobsIndexRoute
  '/runners': typeof RunnersIndexRoute
  '/sas': typeof SasIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/jobs/$id': typeof JobsIdRoute
  '/runners/$id': typeof RunnersIdRoute
  '/runners/stats': typeof RunnersStatsRoute
  '/automations/': typeof AutomationsIndexRoute
  '/jobs/': typeof JobsIndexRoute
  '/runners/': typeof RunnersIndexRoute
  '/sas/': typeof SasIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/jobs/$id'
    | '/runners/$id'
    | '/runners/stats'
    | '/automations'
    | '/jobs'
    | '/runners'
    | '/sas'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/jobs/$id'
    | '/runners/$id'
    | '/runners/stats'
    | '/automations'
    | '/jobs'
    | '/runners'
    | '/sas'
  id:
    | '__root__'
    | '/'
    | '/jobs/$id'
    | '/runners/$id'
    | '/runners/stats'
    | '/automations/'
    | '/jobs/'
    | '/runners/'
    | '/sas/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  JobsIdRoute: typeof JobsIdRoute
  RunnersIdRoute: typeof RunnersIdRoute
  RunnersStatsRoute: typeof RunnersStatsRoute
  AutomationsIndexRoute: typeof AutomationsIndexRoute
  JobsIndexRoute: typeof JobsIndexRoute
  RunnersIndexRoute: typeof RunnersIndexRoute
  SasIndexRoute: typeof SasIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  JobsIdRoute: JobsIdRoute,
  RunnersIdRoute: RunnersIdRoute,
  RunnersStatsRoute: RunnersStatsRoute,
  AutomationsIndexRoute: AutomationsIndexRoute,
  JobsIndexRoute: JobsIndexRoute,
  RunnersIndexRoute: RunnersIndexRoute,
  SasIndexRoute: SasIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/jobs/$id",
        "/runners/$id",
        "/runners/stats",
        "/automations/",
        "/jobs/",
        "/runners/",
        "/sas/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/jobs/$id": {
      "filePath": "jobs/$id.tsx"
    },
    "/runners/$id": {
      "filePath": "runners/$id.tsx"
    },
    "/runners/stats": {
      "filePath": "runners/stats.tsx"
    },
    "/automations/": {
      "filePath": "automations/index.tsx"
    },
    "/jobs/": {
      "filePath": "jobs/index.tsx"
    },
    "/runners/": {
      "filePath": "runners/index.tsx"
    },
    "/sas/": {
      "filePath": "sas/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
