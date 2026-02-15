"use client";

import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "../../../lib/api-config";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  district?: string;
  successfulOrdersCount?: number;
  cancelledOrdersCount?: number;
}

export default function Dashboard() {
  const { userSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        getApiUrl("/users/me"),
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      const userData = response.data.data;
      setProfile(userData);
      setEditData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userSession?.accessToken]);

  const fetchOrdersCount = useCallback(async () => {
    try {
      const response = await axios.get(
        getApiUrl("/orders/my-orders"),
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      setOrdersCount(response.data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching orders count:", error);
    }
  }, [userSession?.accessToken]);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchProfile();
      fetchOrdersCount();
    }
  }, [userSession, fetchProfile, fetchOrdersCount]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.patch(
        getApiUrl("/users/me"),
        editData,
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      setProfile(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="w-full flex justify-center items-center min-h-[320px]">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1 border border-pink-100">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[11px] font-medium text-pink-700">
              Loading your dashboard
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Fetching your profile and recent activity. Please wait a moment.
          </p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="w-full flex justify-center items-center min-h-[320px]">
        <div className="max-w-md w-full text-center space-y-3 rounded-2xl border border-red-100 bg-red-50/70 px-6 py-6">
          <p className="text-sm font-semibold text-red-700">
            প্রোফাইল লোড করা যায়নি
          </p>
          <p className="text-xs md:text-sm text-red-600">
            অনুগ্রহ করে পেজটি রিফ্রেশ করুন বা একটু পরে আবার চেষ্টা করুন।
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-pink-100 pb-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-pink-600 uppercase">
          My account
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Welcome back, {profile.name || "customer"} 👋
        </h2>
        <p className="text-sm text-gray-600">
          আপনার প্রোফাইল, অর্ডার এবং লগইন তথ্য এক জায়গা থেকে ম্যানেজ করুন।
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="mt-1 text-lg font-semibold text-primary">
              {ordersCount}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">Email</p>
            <p className="mt-1 text-sm font-medium text-gray-900 truncate">
              {profile.email}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">Phone</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {profile.phone || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-col">
        <div className="flex gap-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Account information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs md:text-sm text-primary flex gap-1 items-center hover:underline"
            >
              Edit
              <FaEdit />
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone number
              </label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full address
              </label>
              <input
                type="text"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 rounded-md bg-primary text-sm font-medium text-white hover:bg-primary/90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                  });
                }}
                className="px-4 py-2 rounded-md bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Full name
              </p>
              <p className="text-sm font-medium text-gray-900">
                {profile.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Phone number
              </p>
              <p className="text-sm font-medium text-gray-900">
                {profile.phone || "Not provided"}
              </p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Full address
              </p>
              <p className="text-sm font-medium text-gray-900">
                {profile.address || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-col">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Login details
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Email
            </p>
            <p className="text-sm font-medium text-gray-900">{profile.email}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Password
              </span>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="h-2 w-2 bg-gray-500 rounded-full inline-block" />
                ))}
            </div>
            <button className="flex gap-1 items-center text-xs md:text-sm text-primary hover:underline">
              Reset
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
