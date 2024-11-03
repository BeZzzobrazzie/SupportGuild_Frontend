import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import App from "src/00_app";

export const Route = createRootRoute({
  component: App,
});
