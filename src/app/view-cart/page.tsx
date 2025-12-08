"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartProduct from "@/app/checkout/_components/CartProduct";
import formatteeNumber from "@/utils/formatteNumber";
import { getProduct } from "@/lib/api-services";
import { API_CONFIG } from "@/lib/api-config";
import Link from "next/link";
import { Button } from "antd";

const ViewCart = () => {
  const { userSession } = useAuth();
  const { cart, loading } = useCart();
  const router = useRouter();

  const [enrichedItems, setEnrichedItems] = useState<Array<{
    id: number;
    product: { id: number; name: string; thumbnail?: string; images?: { url: string; alt?: string }[] };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!userSession?.accessToken || !userSession?.userId)) {
      router.push("/login");
    }
  }, [userSession, loading, router]);

  // Fetch product details for cart items
  useEffect(() => {
    const enrichCartItems = async () => {
      if (!cart?.items || !Array.isArray(cart.items) || !cart.items.length || !userSession?.companyId) {
        setEnrichedItems([]);
        return;
      }

      try {
        const companyId = userSession.companyId || API_CONFIG.companyId;
        const enriched = await Promise.all(
          cart.items.map(async (item) => {
            // If product already has name, use it
            if (item.product?.name) {
              return item;
            }
            // Otherwise fetch product details
            try {
              const product = await getProduct(item.product.id, companyId);
              return {
                ...item,
                product: {
                  id: product.id,
                  name: product.name,
                  thumbnail: product.thumbnail,
                  images: product.images,
                },
              };
            } catch (error) {
              console.error(`Failed to fetch product ${item.product.id}:`, error);
              return item;
            }
          })
        );
        setEnrichedItems(enriched);
      } catch (error) {
        console.error("Failed to enrich cart items:", error);
        setEnrichedItems(Array.isArray(cart.items) ? cart.items : []);
      }
    };

    enrichCartItems();
  }, [cart?.items, userSession?.companyId]);

  // Use enriched items or fallback to cart items
  const items = useMemo(() => {
    return enrichedItems.length > 0 ? enrichedItems : (Array.isArray(cart?.items) ? cart.items : []);
  }, [enrichedItems, cart?.items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.unitPrice || 0) * (item.quantity || 0), 0),
    [items]
  );

  // Show loading state
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg">Loading cart...</p>
        </div>
      </section>
    );
  }

  // Show empty cart state
  if (!cart || !items.length) {
    return (
      <section className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="text-2xl font-medium">আপনার কার্ট খালি</h1>
          <p className="text-gray-600">আপনার কার্টে কোনো পণ্য নেই</p>
          <Link href="/products">
            <Button type="primary" size="large">
              শপিং করুন
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-5 py-10">
      <div className="grid min-[950px]:grid-cols-3 gap-5">
        {/* Cart Items */}
        <div className="min-[950px]:col-span-2">
          <div className="bg-white rounded-md shadow p-5">
            <h1 className="text-2xl font-medium mb-6">আপনার কার্ট ({items.length} টি পণ্য)</h1>
            
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-b-0">
                  <CartProduct item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="min-[950px]:col-span-1">
          <div className="bg-gray-50 p-5 rounded-md shadow sticky top-20">
            <h2 className="text-xl font-medium mb-4">কার্ট সারাংশ</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {/* Item summary */}
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span className="line-clamp-1">{item.product.name} × {item.quantity}</span>
                    <span>{formatteeNumber(item.unitPrice * item.quantity)}৳</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700">সাবটোটাল</p>
                  <p className="font-medium">{formatteeNumber(subtotal)}৳</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <p>শিপিং</p>
                  <p>চেকআউটে গণনা করা হবে</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">মোট</p>
                  <p className="font-bold text-lg">{formatteeNumber(subtotal)}৳</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">* শিপিং চার্জ চেকআউটে যোগ হবে</p>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button 
                type="primary" 
                size="large" 
                block
                className="w-full"
              >
                চেকআউট করুন
              </Button>
            </Link>

            <Link href="/products" className="block mt-3">
              <Button 
                size="large" 
                block
                className="w-full"
              >
                আরো পণ্য দেখুন
              </Button>
            </Link>

            <p className="text-sm text-center mt-4 text-gray-600">
              যেকোনো সমস্যায় নির্দ্বিধায় যোগাযোগ করুন- 01774617452
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewCart;

