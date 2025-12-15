"use client";

import { Slider } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

const PriceFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get values from URL or use defaults
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [value, setValue] = useState<[number, number]>([
    minPrice ? Number(minPrice) : DEFAULT_MIN_PRICE,
    maxPrice ? Number(maxPrice) : DEFAULT_MAX_PRICE,
  ]);

  // Sync component state with URL when search params change
  useEffect(() => {
    const newMin = minPrice ? Number(minPrice) : DEFAULT_MIN_PRICE;
    const newMax = maxPrice ? Number(maxPrice) : DEFAULT_MAX_PRICE;

    // Only update if values are different
    if (newMin !== value[0] || newMax !== value[1]) {
      setValue([newMin, newMax]);
    }
  }, [minPrice, maxPrice, value]);

  // Update URL when user changes slider values
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value[0] === DEFAULT_MIN_PRICE && value[1] === DEFAULT_MAX_PRICE) {
      newSearchParams.delete("minPrice");
      newSearchParams.delete("maxPrice");
    } else {
      newSearchParams.set("minPrice", value[0].toString());
      newSearchParams.set("maxPrice", value[1].toString());
    }

    const newUrl = `?${newSearchParams.toString()}`;
    const currentUrl = `?${searchParams.toString()}`;

    if (newUrl !== currentUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [value, router, searchParams]);

  return (
    <div>
      <h2 className="text-xl font-medium">Price</h2>
      <div>
        <Slider
          range
          value={value}
          onChange={(val) => setValue(val as [number, number])}
          min={DEFAULT_MIN_PRICE}
          max={DEFAULT_MAX_PRICE}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
