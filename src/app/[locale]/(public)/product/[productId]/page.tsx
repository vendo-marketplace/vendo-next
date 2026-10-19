import type { Metadata } from "next";

import ProductDetails from "@/features/products/components/product-details/ProductDetails";

export const metadata: Metadata = {
  title: "Оголошення",
  description: "Детальна інформація про товар на Vendo.",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return (
    <ProductDetails productId={productId} />
  );
}
