"use client";

interface CouponCodeProps {
  promoCode: string;
  setPromoCode: (v: string) => void;
  applyPromo: () => void;
  loading?: boolean;
  appliedPromo?: { code: string } | null;
}

const CouponCode = ({ promoCode, setPromoCode, applyPromo, loading, appliedPromo }: CouponCodeProps) => {
  return (
    <div className=" flex flex-col gap-2">
      <div className=" flex gap-2 items-center justify-between">
        <input
          className=" border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 focus:border-[#6d198a] placeholder:text-gray-500 flex-1"
          type="text"
          placeholder="Coupon Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button
          type="button"
          onClick={applyPromo}
          disabled={loading}
          className=" bg-primary text-white w-[40%] py-3 px-5 rounded-md disabled:opacity-70"
        >
          {loading ? "Applying..." : appliedPromo ? "Update" : "Apply"}
        </button>
      </div>
      {appliedPromo && <p className="text-sm text-green-600">Applied: {appliedPromo.code}</p>}
    </div>
  );
};

export default CouponCode;
