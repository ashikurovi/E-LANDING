import { MdLogout } from "react-icons/md";
import Menu from "./Menu";
import UserInfo from "./UserInfo";

const SideBar = () => {
  return (
    <div>
      <div className="bg-[#F8F8F8] min-h-[80vh] p-3 sticky top-20 flex flex-col gap-3 justify-between">
        <div className="  flex flex-col gap-3 ">
          <div>
            <UserInfo />
          </div>
          <div className=" w-full bg-gray-200 h-[1px]"></div>
          <div>
            <Menu />
          </div>
        </div>

        <div>
          <div className=" w-full bg-gray-200 h-[1px] mb-3"></div>
          <button className=" flex items-center gap-2 bg-primary text-white p-2 rounded-md w-full justify-center hover:bg-primary/85 transition-all">
            <MdLogout /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
