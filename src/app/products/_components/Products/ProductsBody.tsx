"use client";

import ProductCard from "@/components/ui/ProductCard";
import PaginationProducts from "./PaginationProducts";
import { getProducts, getProductsByCategory, Product } from "@/lib/api-services";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageProps {
  name: string;
  url: string;
}
interface ReviewProps {
  rating: number;
}
interface VariantProps {
  price: number;
  size: string;
  available_quantity: number;
  stock_status: string;
}
interface ProductProps {
  SKU: string;
  documentId: string;
  off: number;
  title: string;
  images: ImageProps[];
  reviews: ReviewProps[];
  variant: VariantProps[];
}

// Helper function to map REST API product to component format
function mapProductToCardFormat(apiProduct: Product): ProductProps {
  const off = apiProduct.discountPrice && apiProduct.price
    ? Math.round(((apiProduct.price - apiProduct.discountPrice) / apiProduct.price) * 100)
    : 0;

  const images: ImageProps[] = apiProduct.images?.map((img, index) => ({
    name: img.alt || `Image ${index + 1}`,
    url: img.url,
  })) || [];

  const variant: VariantProps[] = [{
    price: Number(apiProduct.price),
    size: "Default",
    available_quantity: 100, // Default value - would need to come from inventory if available
    stock_status: apiProduct.isActive ? "in_stock" : "out_of_stock",
  }];

  return {
    SKU: apiProduct.sku,
    documentId: apiProduct.id.toString(),
    off,
    title: apiProduct.name,
    images,
    reviews: [],
    variant,
  };
}

const ProductsBody = () => {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("categories");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiProducts: Product[] = [];

        if (categoryName) {
          // Use getProductsByCategory when category is selected
          apiProducts = await getProductsByCategory('COMP-000001', categoryName);
        } else {
          // Use getProducts when no category is selected
          apiProducts = await getProducts('COMP-000001');
        }

        const mappedProducts = apiProducts.map(mapProductToCardFormat);
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <section className="flex flex-col gap-10 justify-between items-center">
        <div className="w-full text-center py-10">
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-10 justify-between items-center">
        <div className="w-full text-center py-10">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="flex flex-col gap-10 justify-between items-center">
        <div className="w-full text-center py-10">
          <p>No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10 justify-between items-center">
      <div className=" grid sm:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] w-full gap-3">
        {products.map((product) => (
          <div key={product.SKU || product.documentId}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <PaginationProducts total={products.length} />
    </section>
  );
};

export default ProductsBody;
