"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "@/lib/api-config";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  district?: string;
}

export default function Address() {
  const { userSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    district: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchProfile();
    }
  }, [userSession]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(getApiUrl("/users/me"), {
        headers: getApiHeaders(userSession?.accessToken),
      });
      const userData = response.data.data;
      setProfile(userData);
      setFormData({
        address: userData.address || "",
        district: userData.district || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.patch(
        getApiUrl("/users/me"),
        formData,
        {
          headers: getApiHeaders(userSession?.accessToken),
        }
      );
      setProfile(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        address: profile.address || "",
        district: profile.district || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
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
        <p>Failed to load address. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] p-3 w-full flex flex-col gap-5">
      <div>
        <h2 className="text-3xl font-medium text-primary">SAVED ADDRESS</h2>
        <p>Manage your delivery addresses here.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Default Address</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary flex gap-1 items-center hover:underline"
            >
              <FaEdit size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-green-600 flex gap-1 items-center hover:underline disabled:opacity-50"
              >
                <FaSave size={14} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 flex gap-1 items-center hover:underline"
              >
                <FaTimes size={14} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                placeholder="Enter district"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter full address"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="text-base font-medium">
                {profile.phone || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">District</p>
              <p className="text-base font-medium">
                {profile.district || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Full Address</p>
              <p className="text-base font-medium">
                {profile.address || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
