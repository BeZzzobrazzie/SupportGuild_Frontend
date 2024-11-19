/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as OrganizationInfoImport } from './routes/organization-info'
import { Route as OperatorsImport } from './routes/operators'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const OrganizationInfoRoute = OrganizationInfoImport.update({
  id: '/organization-info',
  path: '/organization-info',
  getParentRoute: () => rootRoute,
} as any)

const OperatorsRoute = OperatorsImport.update({
  id: '/operators',
  path: '/operators',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
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
    '/operators': {
      id: '/operators'
      path: '/operators'
      fullPath: '/operators'
      preLoaderRoute: typeof OperatorsImport
      parentRoute: typeof rootRoute
    }
    '/organization-info': {
      id: '/organization-info'
      path: '/organization-info'
      fullPath: '/organization-info'
      preLoaderRoute: typeof OrganizationInfoImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/operators': typeof OperatorsRoute
  '/organization-info': typeof OrganizationInfoRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/operators': typeof OperatorsRoute
  '/organization-info': typeof OrganizationInfoRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/operators': typeof OperatorsRoute
  '/organization-info': typeof OrganizationInfoRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/operators' | '/organization-info'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/operators' | '/organization-info'
  id: '__root__' | '/' | '/operators' | '/organization-info'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  OperatorsRoute: typeof OperatorsRoute
  OrganizationInfoRoute: typeof OrganizationInfoRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  OperatorsRoute: OperatorsRoute,
  OrganizationInfoRoute: OrganizationInfoRoute,
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
        "/operators",
        "/organization-info"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/operators": {
      "filePath": "operators.tsx"
    },
    "/organization-info": {
      "filePath": "organization-info.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
