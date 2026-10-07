import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("routes/home.tsx"),
  route("/recepies", "routes/recepies.tsx"),
  route("/recepies/:slug", "routes/recipe.tsx"),
  route("/posts/pages/:page", "routes/home.tsx", { id: "paginated-posts" }),
  route("/projects/pages/:page", "routes/home.tsx", { id: "paginated-projects" }),
  route("/rss.xml", "routes/rss.tsx"),
] satisfies RouteConfig;
