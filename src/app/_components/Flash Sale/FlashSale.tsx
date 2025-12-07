import { getFlashSaleProducts } from "@/lib/api-services";
import CountDown from "./CountDown";
import FlashSaleProduct from "./FlashSaleProduct";

const FlashSale = async () => {
  let flashSaleProducts: any[] = [];
  
  try {
    flashSaleProducts = await getFlashSaleProducts();
  } catch (error) {
    console.error("Failed to load flash sale products:", error);
    // flashSaleProducts will remain empty array
  }

  // If there are no flash sale products, don't show the section
  if (flashSaleProducts.length === 0) {
    return null;
  }

  // Calculate average discount from flash sale products
  const avgDiscount = flashSaleProducts.length > 0
    ? Math.round(
        flashSaleProducts.reduce((sum, p) => {
          const discount = p.flashSellPrice && p.price
            ? Math.round(((p.price - p.flashSellPrice) / p.price) * 100)
            : 0;
          return sum + discount;
        }, 0) / flashSaleProducts.length
      )
    : 0;

  return (
    <section className=" max-w-7xl mx-auto px-5 md:pt-10 pt-5 ">
      <div
        className="rounded-md overflow-hidden bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(/images/payment-gateway.webp)`,
        }}
      >
        <div className=" bg-black/30 backdrop-blur-md sm:p-8 p-5 flex flex-col gap-3">
          <div className=" flex justify-between sm:gap-5 gap-2 flex-col sm:flex-row">
            <div className="text-white">
              <h2 className=" sm:text-2xl text-xl font-bold">
                ফ্ল্যাশ সেল
              </h2>
              <p className=" sm:text-sm text-xs">
                {`${avgDiscount}% পর্যন্ত ফ্ল্যাশ সেল ডিল উপভোগ করুন!`}
              </p>
            </div>
            <div>
              <CountDown />
            </div>
          </div>
          <div>
            <FlashSaleProduct />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
