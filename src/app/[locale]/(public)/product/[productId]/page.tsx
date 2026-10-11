import type { Metadata } from "next";

import ProductDetails from "@/features/products/components/product-details/ProductDetails";

export const metadata: Metadata = {
  title: "Оголошення",
  description: "Детальна інформація про товар на Vendo.",
};

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { productId } = await params;
  const { q = "" } = await searchParams;


  return (
    <ProductDetails
      productId={productId}
      searchTerm={q}
    />
  );
}
