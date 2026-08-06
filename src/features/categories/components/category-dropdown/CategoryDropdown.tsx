import { getCategoryOptions } from "../../server/get-category-options";

import CategoryDropdownClient from "./CategoryDropdownClient";

export default async function CategoryDropdown() {
  const result = await getCategoryOptions();
  if (!result.success)
    return <CategoryDropdownClient categories={[]} unavailable={true} />;
  const { data: categories } = result;

  return <CategoryDropdownClient categories={categories} />;
}
