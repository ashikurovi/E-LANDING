import { getProduct, getProductReviews, getRefundPolicies } from "@/lib/api-services";
import type { Product } from "@/lib/api-services";
import { API_CONFIG } from "@/lib/api-config";
import { Suspense } from "react";
import BreadCrumb from "../_components/Product/Breadcrumb";
import ImageGallery from "../_components/Product/ImageGallery";
import ProductDetails from "../_components/Product/ProductDetails";
import RelatedProducts from "../_components/Product/RelatedProducts";
import Tab from "../_components/Product/Tabs";
import { notFound } from "next/navigation";
import { Review } from "@/types/review";
import { ReturnPolicy } from "@/types/return-policy";

interface CategoryProps {
  name: string;
  slug: string;
}
interface List {
  id: string;
  item: string;
}

interface ListItems {
  id: string;
  title: string;
  list: List[];
}
interface DescriptionProps {
  id: string;
  summary: string;
  list_items: ListItems[];
}
interface ImageProps {
  name: string;
  url: string;
}
interface VariantProps {
  available_quantity: number;
  id: string;
  price: number;
  size: string;
  stock_status: string;
}
interface ProductProps {
  id?: number;
  SKU: string;
  documentId: string;
  off: number;
  price: number;
  discountPrice?: number;
  title: string;
  total_sale: number;
  categories: CategoryProps[];
  description: DescriptionProps;
  images: ImageProps[];
  reviews: Review[];
  variant: VariantProps[];
  companyId?: string;
}

// Helper function to map REST API product to component format
function mapProductToComponentFormat(apiProduct: Product, reviews: Review[], companyId: string): ProductProps {
  // Calculate discount percentage
  const off = apiProduct.discountPrice && apiProduct.price
    ? Math.round(((apiProduct.price - apiProduct.discountPrice) / apiProduct.price) * 100)
    : 0;

  // Map images
  const images: ImageProps[] = apiProduct.images?.map((img: { url: string; alt?: string }, index: number) => ({
    name: img.alt || `Image ${index + 1}`,
    url: img.url,
  })) || [];

  // Create a single variant from the product price
  const variant: VariantProps[] = [{
    id: apiProduct.id.toString(),
    price: Number(apiProduct.price),
    size: "Default",
    available_quantity: 100, // Default value - would need to come from inventory if available
    stock_status: apiProduct.isActive ? "in_stock" : "out_of_stock",
  }];

  // Map category to categories array
  const categories: CategoryProps[] = apiProduct.category ? [{
    name: apiProduct.category.name,
    slug: apiProduct.category.slug,
  }] : [];

  // Map description
  const description: DescriptionProps = {
    id: apiProduct.id.toString(),
    summary: apiProduct.description || "",
    list_items: [],
  };

  return {
    id: apiProduct.id,
    SKU: apiProduct.sku,
    documentId: apiProduct.id.toString(),
    off,
    price: Number(apiProduct.price),
    discountPrice: apiProduct.discountPrice ? Number(apiProduct.discountPrice) : undefined,
    title: apiProduct.name,
    total_sale: 0, // Not available in REST API
    categories,
    description,
    images,
    reviews,
    variant,
    companyId,
  };
}

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let product: ProductProps;
  let returnPolicyContent = "";
  try {
    const companyId = API_CONFIG.companyId;
    const [apiProduct, apiReviews, returnPolicies] = await Promise.all([
      getProduct(parseInt(id), companyId),
      getProductReviews(parseInt(id), companyId),
      getRefundPolicies(companyId),
    ]);
    const returnPolicy = (returnPolicies as ReturnPolicy[])[0];

    // Normalize reviews to component format
    const mappedReviews: Review[] = apiReviews.map((review) => ({
      id: review.id,
      productId: review.productId ?? apiProduct.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      companyId: review.companyId ?? companyId,
      createdAt: review.createdAt,
      userName: review.userName ?? "Customer",
    }));

    product = mapProductToComponentFormat(apiProduct, mappedReviews, companyId);
    returnPolicyContent = returnPolicy?.content || "";
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  return (
    <Suspense fallback={<div> loading ...</div>}>
      <section className=" max-w-7xl mx-auto px-5 py-10">
        <div>
          {/* top breadcrumb section  */}
          <div>
            {/* breadcrumb section  */}
            <BreadCrumb title={product?.title} />
          </div>
          {/* middle section  */}
          <div className=" mt-3 flex md:flex-row flex-col gap-5">
            {/* image gallery section  */}
            <div className=" flex-1">
              <ImageGallery images={product?.images} />
            </div>
            {/* product details section  */}
            <div className=" flex-1">
              <ProductDetails product={product} />
            </div>
          </div>
          {/* description additional info reviews return policies section  */}
          <div className=" border sm:p-5 p-2 rounded mt-5 overflow-hidden">
            <Tab product={product} returnPolicyContent={returnPolicyContent} />
          </div>
          {/* bottom related products section  */}
          <div>
            <RelatedProducts id={id} />
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Product;
