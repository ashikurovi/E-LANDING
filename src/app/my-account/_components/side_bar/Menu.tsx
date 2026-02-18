"use client";
import { cn } from "../../../../utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineFeed,
  MdOutlineLocationOn,
  MdOutlineReviews,
} from "react-icons/md";
import { RiHome5Line } from "react-icons/ri";

const menuItems = [
  {
    id: 1,
    name: "Dashboard",
    icon: <RiHome5Line size={20} />,
    link: "dashboard",
  },
  {
    id: 2,
    name: "My Orders",
    icon: <MdOutlineFeed size={20} />,
    link: "orders",
  },
  {
    id: 3,
    name: "Saved Address",
    icon: <MdOutlineLocationOn size={20} />,
    link: "address",
  },
  {
    id: 4,
    name: "Reviews",
    icon: <MdOutlineReviews size={20} />,
    link: "reviews",
  },
];

const Menu = () => {
  const path = usePathname().split("/").pop();
  console.log(path);
  return (
    <div className=" flex flex-col gap-3">
      {menuItems.map((item) => (
        <Link
          href={`/my-account/${item.link}`}
          key={item.id}
          className={cn(
            " flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 transition-all hover:text-primary cursor-pointer",
            path === item.link ? "bg-gray-200 text-primary" : ""
          )}
        >
          <div>{item.icon}</div>
          <div>{item.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
