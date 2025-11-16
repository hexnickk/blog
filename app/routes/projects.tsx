import type { Route } from "./+types/projects";
import { Layout } from "app/components/layout";
import { H2 } from "app/components/ui/typography";
import { Link } from "app/components/ui/link";
import { Config } from "app/modules/config";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Projects - ${Config.siteName}` },
    { name: "description", content: "My projects and experiments" },
  ];
}

export default function Projects() {
  return (
    <Layout>
      <div className="relative flex flex-col gap-12 md:gap-16">
        <section className="gap-6">
          <H2>Projects</H2>
          <div className="mt-6 ml-6">
            <ul className="list-disc space-y-4">
              <li>
                <Link to="/projects/masks" className="font-semibold">
                  Masks
                </Link>
                {" - "}
                <span className="text-gray-700">
                  Interactive halftone mask generator
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
}
