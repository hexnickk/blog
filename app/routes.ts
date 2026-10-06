import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("routes/home.tsx"),
  route("/pages/:page", "routes/home.tsx", { id: "paginated-home" }),
  route("/rss.xml", "routes/rss.tsx"),
] satisfies RouteConfig;
