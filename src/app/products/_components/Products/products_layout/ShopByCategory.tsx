"use client";

import { getCategories } from "@/lib/api-services";
import { Checkbox } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface CategoryProps {
  name: string;
  id: number;
  slug: string;
  image?: {
    url: string;
    alt?: string;
  };
}

const ShopByCategory: React.FC = () => {
  const { userSession } = useAuth();
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get selected categories from URL
  const selectedValues = useMemo(
    () => searchParams.get("categories")?.split(",") || [],
    [searchParams]
  );

  const [checkedValues, setCheckedValues] = useState<string[]>(selectedValues);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories(userSession?.accessToken, userSession?.companyId);
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [userSession?.accessToken, userSession?.companyId]);

  // Sync state with URL changes (when manually updated)
  useEffect(() => {
    setCheckedValues(selectedValues);
  }, [selectedValues]);

  const handleChange = (values: string[]) => {
    setCheckedValues(values);

    // Avoid updating URL if values are unchanged
    if (values.join(",") === selectedValues.join(",")) return;

    const params = new URLSearchParams(searchParams.toString());

    if (values.length > 0) {
      params.set("categories", values.join(","));
    } else {
      params.delete("categories");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!categories || categories.length === 0) return <p>No categories found.</p>;

  return (
    <div>
      <h2 className="text-xl font-medium">Shop By Category</h2>
      <Checkbox.Group value={checkedValues} onChange={handleChange}>
        <div className="flex flex-col">
          {categories.map((category: CategoryProps) => (
            <Checkbox key={category.slug} value={category.name}>
              {category.name}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default ShopByCategory;
