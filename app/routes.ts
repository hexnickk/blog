import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/posts/:slug", "routes/posts/$slug.tsx"),
  route("/rss.xml", "routes/rss.tsx"),
  route('/projects/halftone', 'routes/projects/halftone.tsx'),
] satisfies RouteConfig;
