"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "../../../lib/api-config";
import { TbCurrencyTaka } from "react-icons/tb";

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    image?: string;
    sku?: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  customerAddress?: string;
  createdAt: string;
  items: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "paid":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Orders = () => {
  const { userSession } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl("/orders/my-orders"), {
        headers: getApiHeaders(userSession?.accessToken),
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [userSession?.accessToken]);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchOrders();
    }
  }, [userSession, fetchOrders]);

  const isOrderCancellable = (order: Order): boolean => {
    if (order.status.toLowerCase() === "cancelled") return false;
    if (order.status.toLowerCase() === "delivered") return false;
    
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await axios.patch(
        getApiUrl(`/orders/${orderId}/cancel`),
        {},
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      alert("Order cancelled successfully!");
      fetchOrders(); // Refresh orders list
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Failed to cancel order. Please try again.";
      alert(errorMessage);
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F8F8F8] p-3 w-full flex items-center justify-center min-h-[400px]">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[#F8F8F8] p-3 w-full flex flex-col gap-5">
        <h2 className="text-3xl font-medium text-primary">MY ORDERS</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">No orders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] p-3 w-full flex flex-col gap-5">
      <h2 className="text-3xl font-medium text-primary">MY ORDERS</h2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} ×{" "}
                        <span className="inline-flex items-center">
                          <TbCurrencyTaka size={12} />
                          {item.unitPrice}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center text-primary font-medium">
                      <TbCurrencyTaka size={18} />
                      <span>{item.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod}
                  </p>
                  {order.customerAddress && (
                    <p className="text-sm text-gray-600 mt-1">
                      Address: {order.customerAddress}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-xl font-bold text-primary">
                  <TbCurrencyTaka size={24} />
                  <span>{order.totalAmount}</span>
                </div>
              </div>
              {isOrderCancellable(order) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
