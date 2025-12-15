"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders, API_CONFIG } from "@/lib/api-config";
import { getCategories, getProductsByCategory, Product } from "@/lib/api-services";
import type { Category } from "@/types/category";
import { Rate } from "antd";

interface Review {
  id: number;
  productId: number;
  rating: number;
  title?: string;
  comment: string;
  product?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export default function Reviews() {
  const { userSession } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: 0,
    rating: 5,
    title: "",
    comment: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await getCategories(API_CONFIG.companyId);
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const prods = await getProductsByCategory(
        API_CONFIG.companyId,
        selectedCategory
      );
      setProducts(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedCategory]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        getApiUrl("/reviews/my-reviews"),
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      setReviews(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [userSession?.accessToken]);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchCategories();
      fetchReviews();
    }
  }, [userSession, fetchCategories, fetchReviews]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [selectedCategory, fetchProducts]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.comment) {
      alert("Please select a product and write a comment");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        getApiUrl(`/reviews?companyId=${API_CONFIG.companyId}`),
        {
          productId: formData.productId,
          rating: formData.rating,
          title: formData.title || undefined,
          comment: formData.comment,
        },
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      alert("Review submitted successfully!");
      setFormData({
        productId: 0,
        rating: 5,
        title: "",
        comment: "",
      });
      setSelectedProduct(null);
      setShowForm(false);
      fetchReviews();
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      alert(
        axiosError.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProduct(productId);
    setFormData({ ...formData, productId });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="bg-[#F8F8F8] p-3 w-full flex items-center justify-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] p-3 w-full flex flex-col gap-5">
      <div>
        <h2 className="text-3xl font-medium text-primary">REVIEWS</h2>
        <p>Share your experience with our products.</p>
      </div>

      {/* Filter and Product Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium mb-4">Write a Review</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category/Sector
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedProduct(null);
                setShowForm(false);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && products.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                value={selectedProduct || ""}
                onChange={(e) => handleProductSelect(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCategory && products.length === 0 && (
            <p className="text-gray-600">No products found in this category.</p>
          )}

          {showForm && selectedProduct && (
            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <Rate
                  value={formData.rating}
                  onChange={(value) =>
                    setFormData({ ...formData, rating: value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter review title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Write your review..."
                  rows={4}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Existing Reviews */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium mb-4">My Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t written any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {review.product?.name || `Product #${review.productId}`}
                    </h4>
                    {review.title && (
                      <p className="text-sm text-gray-600">{review.title}</p>
                    )}
                  </div>
                  <Rate disabled value={review.rating} />
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
