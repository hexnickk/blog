import * as stylex from "@stylexjs/stylex";
import { Link } from "react-router";
import type { Route } from "./+types/recipe";
import { layoutStyles } from "app/components/layout";
import { recipes } from "app/modules/recipes";

export function loader({ params }: Route.LoaderArgs) {
  const recipe = recipes.find((recipe) => recipe.slug === params.slug);
  if (!recipe) {
    throw new Response("Recipe not found", { status: 404 });
  }
  return recipe;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `${data?.name ?? "Recipe"} - Nick K blog` }];
}

export default function Recipe({ loaderData: recipe }: Route.ComponentProps) {
  return (
    <main {...stylex.props(layoutStyles.layout)}>
      <p>
        <Link to="/recipes" reloadDocument>
          Recipes
        </Link>
      </p>
      <h1>{recipe.name}</h1>
      {recipe.instructions && <h2>Ingredients</h2>}
      <ul {...stylex.props(styles.list)}>
        {recipe.items.map((item) => (
          <li key={item} {...stylex.props(styles.item)}>
            <label {...stylex.props(styles.label)}>
              <input type="checkbox" defaultChecked={false} autoComplete="off" />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      {recipe.instructions && (
        <>
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction) => (
              <li key={instruction} {...stylex.props(styles.item)}>
                {instruction}
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}

const styles = stylex.create({
  list: { listStyle: "none", paddingLeft: 0 },
  item: { marginBottom: 8 },
  label: { display: "flex", alignItems: "baseline", gap: 8, cursor: "pointer" },
});
