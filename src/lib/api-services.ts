/**
 * API Service functions for backend integration
 */
import axios from "axios";
import { getApiUrl, getApiHeaders, API_CONFIG } from "./api-config";
import { Review } from "@/types/review";
import { ReturnPolicy } from "@/types/return-policy";
import { SystemUser } from "@/types/system-user";
import { Category } from "@/types/category";
import { PolicyPage } from "@/types/policy";

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

export interface Banner {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    buttonText?: string;
    buttonLink?: string;
    isActive: boolean;
    order: number;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    message?: string;
    data: T;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    companyId?: string;
}

export interface CartData {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

export interface PromoCode {
    id: number;
    code: string;
    description?: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    startsAt?: string;
    expiresAt?: string;
    isActive: boolean;
    companyId: string;
}

/**
 * Get terms & conditions
 */
export async function getTerms(companyId?: string): Promise<PolicyPage[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<PolicyPage[]> | PolicyPage[]>(
            getApiUrl(`/trems-condetions?${params.toString()}`),
        );

        const payload: any = (response as any).data;
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        return Array.isArray(data) ? data : [];
    } catch (error: any) {
        console.error("Error fetching terms:", error);
        return [];
    }
}

/**
 * Get privacy policy
 */
export async function getPrivacyPolicies(companyId?: string): Promise<PolicyPage[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<PolicyPage[]> | PolicyPage[]>(
            getApiUrl(`/privecy-policy?${params.toString()}`),
        );

        const payload: any = (response as any).data;
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        return Array.isArray(data) ? data : [];
    } catch (error: any) {
        console.error("Error fetching privacy policy:", error);
        return [];
    }
}

/**
 * Get system user info by companyId
 */
export async function getSystemUserByCompanyId(
    companyId?: string,
): Promise<SystemUser | null> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<SystemUser[]> | SystemUser>(
            getApiUrl(`/systemuser?${params.toString()}`),
        );

        const payload: any = (response as any).data;
        const data = Array.isArray(payload?.data) || payload?.data === undefined ? payload?.data ?? payload : payload;
        const users: SystemUser[] = Array.isArray(data) ? data : data ? [data as SystemUser] : [];
        const matched = users.find((user) => user.companyId === companyIdParam);

        return matched ?? users[0] ?? null;
    } catch (error: any) {
        console.error("Error fetching system user:", error);
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
            return null;
        }
        return null;
    }
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
 * Get reviews for a product
 */
export async function getProductReviews(
    productId: number,
    companyId?: string,
): Promise<Review[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Review[]> | Review[]>(
            getApiUrl(`/reviews/product/${productId}?${params.toString()}`),
        );

        const payload: any = (response as any).data;
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        return Array.isArray(data) ? data : [];
    } catch (error: any) {
        console.error("Error fetching product reviews:", error);
        return [];
    }
}

/**
 * Get refund/return policies
 */
export async function getRefundPolicies(
    companyId?: string,
): Promise<ReturnPolicy[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<ReturnPolicy[]> | ReturnPolicy[]>(
            getApiUrl(`/refund-policy?${params.toString()}`),
        );

        const payload: any = (response as any).data;
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        return Array.isArray(data) ? data : [];
    } catch (error: any) {
        console.error("Error fetching refund policies:", error);
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
 * Create a review for a product
 */
export async function createReview(
    payload: { productId: number; rating: number; title?: string; comment: string },
    token: string,
    companyId?: string
): Promise<Review> {
    const params = new URLSearchParams();
    const companyIdParam = companyId || API_CONFIG.companyId;
    if (companyIdParam) params.append("companyId", companyIdParam);

    const response = await axios.post<ApiResponse<Review> | Review>(
        getApiUrl(`/reviews?${params.toString()}`),
        payload,
        {
            headers: getApiHeaders(token),
        }
    );

    const payloadData: any = (response as any).data;
    const data = payloadData?.data ?? payloadData;
    return data as Review;
}

/**
 * Cart APIs
 */
export async function getCart(
    userId: number,
    token: string,
    companyId?: string,
): Promise<CartData> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.get<ApiResponse<CartItem[]> | CartItem[]>(
        getApiUrl(`/cartproducts/user/${userId}?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) },
    );
    const payload: any = (response as any).data;
    const data = Array.isArray(payload?.data) ? payload.data : payload;
    const items: CartItem[] = Array.isArray(data) ? data : [];
    const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const totalPrice = items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);
    return { items, totalItems, totalPrice };
}

export async function addCartItemApi(
    userId: number,
    productId: number,
    quantity: number,

    companyId?: string,
): Promise<CartItem> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.post<ApiResponse<CartItem> | CartItem>(
        getApiUrl("/cartproducts"),
        { userId, productId, quantity, companyId: companyIdParam },

    );
    const payload: any = (response as any).data;
    return (payload?.data ?? payload) as CartItem;
}

export async function updateCartItemApi(
    cartItemId: number,
    quantity: number,

    companyId?: string,
): Promise<CartItem> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.patch<ApiResponse<CartItem> | CartItem>(
        getApiUrl(`/cartproducts/${cartItemId}?companyId=${companyIdParam}`),
        { quantity },

    );
    const payload: any = (response as any).data;
    return (payload?.data ?? payload) as CartItem;
}

export async function deleteCartItemApi(
    cartItemId: number,

    companyId?: string,
): Promise<void> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    await axios.delete(
        getApiUrl(`/cartproducts/${cartItemId}?companyId=${companyIdParam}`),

    );
}

export async function clearCartApi(
    userId: number,
    token: string,
    companyId?: string,
): Promise<void> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    await axios.delete(
        getApiUrl(`/cartproducts/user/${userId}?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) },
    );
}

/**
 * Promo codes
 */
export async function getPromocodes(token: string, companyId?: string): Promise<PromoCode[]> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.get<ApiResponse<PromoCode[]> | PromoCode[]>(
        getApiUrl(`/promocode?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) }
    );
    const payload: any = (response as any).data;
    const data = Array.isArray(payload?.data) ? payload.data : payload;
    return Array.isArray(data) ? data : [];
}

/**
 * Orders
 */
export async function createOrder(
    payload: {
        customerId?: number;
        customerName?: string;
        customerPhone?: string;
        customerAddress?: string;
        shippingAddress?: string;
        paymentMethod?: "DIRECT" | "COD";
        deliveryType?: "INSIDEDHAKA" | "OUTSIDEDHAKA";
        items: { productId: number; quantity: number }[];
    },
    token: string,
    companyId?: string,
): Promise<any> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.post(
        getApiUrl(`/orders?companyId=${companyIdParam}`),
        payload,
        { headers: getApiHeaders(token) }
    );
    return (response as any).data?.data ?? (response as any).data;
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

