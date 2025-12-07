import EmblaCarousel from "@/components/shared/EmblaCarouel";
import ProductCard from "@/components/ui/ProductCard";
import { getProduct, getProducts, Product } from "@/lib/api-services";

interface ImageProps {
  name: string;
  url: string;
}
interface ReviewProps {
  rating: number;
}
interface VariantProps {
  price: number;
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

const RelatedProducts = async ({ id }: { id: string }) => {
  let relatedProducts: ProductProps[] = [];

  try {
    // Get the current product to find its category
    const currentProduct = await getProduct(parseInt(id), 'COMP-000001');
    const categoryName = currentProduct.category?.name;

    // Get products from the same category
    const allProducts = await getProducts('COMP-000001', categoryName);

    // Filter out the current product and limit to 10
    relatedProducts = allProducts
      .filter((p) => p.id.toString() !== id)
      .slice(0, 10)
      .map(mapProductToCardFormat);
  } catch (error) {
    console.error("Error fetching related products:", error);
    // Return empty array on error
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className=" max-w-7xl mx-auto  md:pt-10 pt-5 ">
      <h1 className=" sm:text-2xl text-xl font-bold text-primary">
        Related Products
      </h1>
      <div>
        <EmblaCarousel dragFree arrowButtons>
          {relatedProducts.map((item, index) => (
            <div
              key={item.documentId || index}
              className="[flex:0_0_65%] min-[400px]:[flex:0_0_50%]  min-[500px]:[flex:0_0_45%] sm:[flex:0_0_35%] md:[flex:0_0_30%] min-[880px]:[flex:0_0_27%] lg:[flex:0_0_19%] flex flex-col justify-between gap-3 py-3 cursor-pointer select-none"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </EmblaCarousel>
      </div>
    </section>
  );
};

export default RelatedProducts;
