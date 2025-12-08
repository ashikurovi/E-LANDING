"use client";
import { useAuth } from "@/context/AuthContext";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import React from "react";
import { FaRegUser } from "react-icons/fa6";
import {
  IoCartOutline,
  IoLocationOutline,
  IoLogInOutline,
} from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileDropDown: React.FC = () => {
  const { userSession, logout } = useAuth();
  // console.log(userSession);
  const router = useRouter();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className=" flex  items-center gap-2">
          <div className=" bg-gray-400 w-7 h-7 rounded-full"></div>
          <h2 className=" text-black text-lg">{userSession?.user?.name}</h2>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      icon: <MdOutlineManageAccounts size={20} />,
      label: "Manage Account",
    },
    {
      key: "3",
      icon: <IoCartOutline size={20} />,
      label: "My Orders",
    },
    {
      key: "4",
      icon: <IoLocationOutline size={20} />,
      label: "Address",
    },
    {
      key: "5",
      icon: <IoLogInOutline size={20} style={{ color: "#dc2626" }} />,
      label: "Log out",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "2":
        router.push("/my-account/dashboard");
        break;
      case "3":
        router.push("/my-account/orders");
        break;
      case "4":
        router.push("/my-account/address");
        break;
      case "5":
        if (window.confirm("Are you sure you want to log out?")) {
          logout();
        }
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      overlayStyle={{
        marginTop: "25px",
        marginRight: "-15px",
        width: "200px",
      }}
    >
      <div className=" hover:text-primary transition-all duration-200 ease-linear ">
        <FaRegUser size={20} />
      </div>
    </Dropdown >
  );
};

export default ProfileDropDown;
