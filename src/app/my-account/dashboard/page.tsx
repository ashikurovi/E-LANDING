"use client";

import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "@/lib/api-config";

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

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchProfile();
      fetchOrdersCount();
    }
  }, [userSession]);

  const fetchProfile = async () => {
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
  };

  const fetchOrdersCount = async () => {
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
  };

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
      <div className="bg-[#F8F8F8] p-3 w-full flex items-center justify-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#F8F8F8] p-3 w-full flex items-center justify-center min-h-[400px]">
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] p-3 w-full flex flex-col gap-5">
      <div>
        <h2 className="text-3xl font-medium text-primary">PROFILE</h2>
        <p>
          Welcome back home! Here, you can check all your recent activities.
        </p>
      </div>
      <div>
        <div>
          <div></div>
          <div>
            <h3>{ordersCount}</h3>
            <p>Total Orders</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <h2 className="text-xl font-medium">Account Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary flex gap-1 items-center"
            >
              Edit
              <FaEdit />
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="font-medium">Full Name:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">Phone Number:</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">Full Address:</label>
              <input
                type="text"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-primary text-white rounded"
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
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <ul>
            <li>
              <p>
                <span className="font-medium">Full Name:</span> {profile.name}
              </p>
            </li>
            <li>
              <p>
                <span className="font-medium">Phone Number:</span>{" "}
                {profile.phone || "Not provided"}
              </p>
            </li>
            <li>
              <p>
                <span className="font-medium">Full Address:</span>{" "}
                {profile.address || "Not provided"}
              </p>
            </li>
          </ul>
        )}
      </div>
      <div className="flex gap-2 flex-col">
        <h2 className="text-xl font-medium">Login Details</h2>
        <div className="flex gap-5">
          <div>
            <p>
              <span className="font-medium">Email:</span> {profile.email}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Password:</span>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="h-2 w-2 bg-gray-500 rounded-full inline-block" />
                ))}
            </div>
            <button className="flex gap-1 items-center text-primary">
              Reset
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
