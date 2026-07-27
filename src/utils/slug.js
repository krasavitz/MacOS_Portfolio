/** "Game Dev & Design" → "game-dev-design". Used for clean-site project URLs. */
export const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
