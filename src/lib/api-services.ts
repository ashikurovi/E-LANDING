/**
 * API Service functions for backend integration
 */
import axios from "axios";
import { getApiUrl, getApiHeaders, API_CONFIG } from "./api-config";

// Types
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    discountPrice?: number;
    description?: string;
    images?: { url: string; alt?: string; isPrimary?: boolean }[];
    thumbnail?: string;
    isActive: boolean;
    isFlashSell: boolean;
    flashSellStartTime?: Date;
    flashSellEndTime?: Date;
    flashSellPrice?: number;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: { url: string; alt?: string };
    parent?: Category;
    children?: Category[];
}

export interface Banner {
    id: number;
    name: string;
    slug: string;
    bannerImage?: string;
    isActive: boolean;
}

export interface ApiResponse<T> {
    statusCode: number;
    message?: string;
    data: T;
}

/**
 * Get all products
 */
export async function getProducts(
    companyId?: string,
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products?companyId=${companyIdParam}`),
        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching products:", error);
        // Handle various connection errors
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            (error.cause && error.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
    companyId?: string,
    categoryName?: string,
    categoryId?: number
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);
        if (categoryName) params.append("categories", categoryName);
        if (categoryId) params.append("categoryId", categoryId.toString());

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products/category?${params.toString()}`),
        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching products by category:", error);
        // Handle various connection errors
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            (error.cause && error.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: number, companyId?: string): Promise<Product> {
    try {
        const companyIdParam = companyId || 'COMP-000001';
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<Product>>(
            getApiUrl(`/products/${id}?${params.toString()}`),
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

/**
 * Get trending products
 */
export async function getTrendingProducts(
    days?: number,
    limit?: number,
    companyId?: string
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        if (days) params.append("days", days.toString());
        if (limit) params.append("limit", limit.toString());
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products/trending?${params.toString()}`),
        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching trending products:", error);
        // Handle various connection errors
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            (error.cause && error.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get active flash sell products
 */
export async function getFlashSaleProducts(companyId?: string): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products/flash-sell/active?${params.toString()}`),
        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching flash sale products:", error);
        // Handle various connection errors
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            (error.cause && error.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get all categories
 */
export async function getCategories(companyId?: string): Promise<Category[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Category[]>>(
            getApiUrl(`/categories?${params.toString()}`),

        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        // Handle various connection errors
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            (error.cause && error.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get a single category by ID
 */
export async function getCategory(
    id: number,
    companyId?: string
): Promise<Category> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<Category>>(
            getApiUrl(`/categories/${id}?${params.toString()}`),

        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

/**
 * Get all banners
 */
export async function getBanners(companyId?: string): Promise<Banner[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || 'COMP-000001';
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Banner[]>>(
            getApiUrl(`/banners?${params.toString()}`),

        );
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching banners:", error);
        // Handle various connection errors including AggregateError
        if (
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ENOTFOUND' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('Network Error') ||
            error.message?.includes('fetch failed') ||
            error.message?.includes('AggregateError') ||
            (error.cause && error.cause.code === 'ECONNREFUSED') ||
            (error.name === 'AggregateError')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

