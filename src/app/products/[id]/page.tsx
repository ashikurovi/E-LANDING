import { getProduct } from "@/lib/api-services";
import { Suspense } from "react";
import BreadCrumb from "../_components/Product/Breadcrumb";
import ImageGallery from "../_components/Product/ImageGallery";
import ProductDetails from "../_components/Product/ProductDetails";
import RelatedProducts from "../_components/Product/RelatedProducts";
import Tab from "../_components/Product/Tabs";
import { notFound } from "next/navigation";

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
interface ReviewProps {
  date: string;
  documentId: string;
  rating: number;
  review: string;
  users_permissions_user: {
    username: string;
  };
}
interface VariantProps {
  available_quantity: number;
  id: string;
  price: number;
  size: string;
  stock_status: string;
}
interface ProductProps {
  SKU: string;
  documentId: string;
  off: number;
  title: string;
  total_sale: number;
  categories: CategoryProps[];
  description: DescriptionProps;
  images: ImageProps[];
  reviews: ReviewProps[];
  variant: VariantProps[];
}

// Helper function to map REST API product to component format
function mapProductToComponentFormat(apiProduct: any): ProductProps {
  // Calculate discount percentage
  const off = apiProduct.discountPrice && apiProduct.price
    ? Math.round(((apiProduct.price - apiProduct.discountPrice) / apiProduct.price) * 100)
    : 0;

  // Map images
  const images: ImageProps[] = apiProduct.images?.map((img: any, index: number) => ({
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
    SKU: apiProduct.sku,
    documentId: apiProduct.id.toString(),
    off,
    title: apiProduct.name,
    total_sale: 0, // Not available in REST API
    categories,
    description,
    images,
    reviews: [], // Not available in REST API yet
    variant,
  };
}

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let product: ProductProps;
  try {
    const apiProduct = await getProduct(parseInt(id), 'COMP-000001');
    product = mapProductToComponentFormat(apiProduct);
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
            <Tab product={product} />
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
