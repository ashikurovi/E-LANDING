"use client";
import { useCart } from "@/context/CartContext";
import formatteeNumber from "@/utils/formatteNumber";
// import { calculateAverageRating } from "@/utils/getAverageRating";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";

interface Image {
  name: string;
  url: string;
}

interface Review {
  rating?: number; // Optional because the reviews array may be empty
}

interface Variant {
  price: number;
  size: string;
  available_quantity: number;
  stock_status: string;
}

interface ProductProps {
  id?: number;
  name?: string;
  title?: string;
  documentId?: string;
  off?: number;
  SKU?: string;
  sku?: string;
  price?: number | string;
  discountPrice?: number | string;
  thumbnail?: string;
  reviews?: Review[]; // Array of reviews
  images?: Image[]; // Array of images
  variant?: Variant[]; // Array of price variants
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { addCartItem, cart } = useCart();
  const router = useRouter();

  // Calculate discount percentage from price and discountPrice
  const calculateDiscountPercentage = () => {
    const originalPrice = Number(product?.price || product?.variant?.[0]?.price || 0);
    const discountedPrice = Number(product?.discountPrice || 0);

    if (originalPrice > 0 && discountedPrice > 0 && discountedPrice < originalPrice) {
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }

    // Fallback to off if provided
    return product?.off || 0;
  };

  // Get the final price to display (discountPrice if available, otherwise original price)
  const getFinalPrice = () => {
    const discountedPrice = Number(product?.discountPrice || 0);
    const originalPrice = Number(product?.price || product?.variant?.[0]?.price || 0);

    // If discountPrice exists and is valid, use it; otherwise use original price
    return discountedPrice > 0 && discountedPrice < originalPrice ? discountedPrice : originalPrice;
  };

  // Get the original price for strikethrough
  const getOriginalPrice = () => {
    const originalPrice = Number(product?.price || product?.variant?.[0]?.price || 0);
    const discountedPrice = Number(product?.discountPrice || 0);

    // Only show strikethrough if there's a valid discount
    if (discountedPrice > 0 && discountedPrice < originalPrice) {
      return originalPrice;
    }
    return 0; // Don't show strikethrough if no discount
  };

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0; // Avoid division by zero

    const total = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const average = total / product.reviews.length;

    return Math.min(Math.max(average, 0), 5); // Ensuring the value is within 0-5 range
  };

  const available_variant = product?.variant?.filter(
    (i) => i.available_quantity > 0
  ) || [];

  const handleAddProduct = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const productId = product?.id || product?.documentId;
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    if (available_variant && available_variant.length > 0) {
      try {
        await addCartItem(Number(productId), 1);
        toast.success("Product added to cart!");
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    } else if (product?.price !== undefined) {
      // If no variant but product has price, allow adding
      try {
        await addCartItem(Number(productId), 1);
        toast.success("Product added to cart!");
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    } else {
      toast.error("Product is out of stock!");
    }
  };

  const handleBuyNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const productId = product?.documentId || product?.id;
    if (productId) {
      router.push(`/products/${productId}?${new URLSearchParams({ companyId: 'COMP-000001' }).toString()}`);
    }
  };
  return (
    <Link
      href={`/products/${product?.documentId || product?.id}?${new URLSearchParams({ companyId: 'COMP-000001' }).toString()}`}
      className=" bg-[#F3F3F3] p-2 rounded-lg  flex flex-col justify-between sm:gap-3 gap-2 shadow group/product cursor-pointer"
    >
      {/* image use here  */}
      <div className=" relative overflow-hidden rounded-lg">
        <Image
          src={product?.thumbnail || ''}
          alt=""
          width={500}
          height={500}
          className=" rounded-lg aspect-[7/5] group-hover/product:scale-[1.05] transition-all duration-200 ease-linear"
        />
        {calculateDiscountPercentage() > 0 && (
          <div className=" absolute top-2 left-2 bg-primary px-1.5 py-0.5  rounded-2xl font-bold sm:text-xs text-[10px]  text-white max-w-max">
            save {calculateDiscountPercentage()}%
          </div>
        )}
        <button
          onClick={handleAddProduct}
          className="absolute top-2 right-2 cursor-pointer bg-white p-0.5 rounded hover:bg-primary hover:text-white transition-all duration-150 ease-in md:group-hover/product:block md:hidden"
        >
          <IoCartOutline size={18} />
        </button>
      </div>
      <div className=" flex flex-col sm:gap-2 gap-1">
        <h2 className=" text-gray-800 line-clamp-1 sm:text-base text-sm">
          {product?.title || product?.name}
        </h2>
        <div className=" flex items-center gap-2">
          <div className=" flex items-center text-primary">
            <span className=" text-2xl sm:text-3xl">
              <TbCurrencyTaka />
            </span>
            <h2 className=" mt-[2px] sm:text-2xl text-xl font-bold ">
              {formatteeNumber(getFinalPrice())}
            </h2>
          </div>
          {getOriginalPrice() > 0 && (
            <div className=" flex items-center text-gray-600">
              <span>
                <TbCurrencyTaka size={15} />
              </span>
              <h2 className=" mt-[2px] line-through font-light  sm:text-base text-sm">
                {formatteeNumber(getOriginalPrice())}
              </h2>
            </div>
          )}
        </div>
        <div className="  flex items-center justify-between">
          <Rate disabled allowHalf defaultValue={calculateAverageRating()} />
          <button
            onClick={handleBuyNow}
            className="md:text-sm sm:text-xs text-[10px] hover:bg-black bg-primary text-white max-w-max sm:px-3 px-2 py-[4px] rounded-2xl  transition-all ease-linear duration-200"
          >
            <span>এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
