import * as stylex from "@stylexjs/stylex";
import { Link } from "react-router";
import { layoutStyles } from "app/components/layout";
import { recipes } from "app/modules/recipes";

export function meta() {
  return [{ title: "Recipes - Nick K blog" }];
}

export default function Recipes() {
  return (
    <main {...stylex.props(layoutStyles.layout)}>
      <p>
        <Link to="/" reloadDocument>
          Home
        </Link>
      </p>
      <section>
        <h2>Recipes</h2>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.slug} {...stylex.props(styles.entry)}>
              <Link to={`/recepies/${recipe.slug}`} reloadDocument>
                {recipe.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const styles = stylex.create({
  entry: { marginBottom: 16 },
});
