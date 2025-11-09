import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/posts/:slug", "routes/posts/$slug.tsx"),
  route("/rss.xml", "routes/rss.tsx"),
  route('/projects/masks', 'routes/projects/masks/masks.page.tsx'),
] satisfies RouteConfig;
