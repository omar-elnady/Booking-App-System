import React from "react";
import { Menu } from "lucide-react";
import DropdownMenu from "../DropdownMenu";
const MobileMenu = ({ links }) => {
  return (
    <div className="md:hidden">
      <DropdownMenu
        items={links}
        cancelDefultStyle={true}
        menuName={<Menu className="dark:text-white" />}
        classMenuBtn={`px-1 py-2 rounded shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600`}
      />
    </div>
  );
};

export default MobileMenu;
