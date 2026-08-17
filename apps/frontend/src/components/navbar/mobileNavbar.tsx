import { PropsWithChildren } from "react";

import { Bars3Icon } from "@heroicons/react/16/solid";
import Sidebar from "../ui/SideBar";

type Props = PropsWithChildren;

const MobileNavbar = (props: Props) => {
  return (
    <div className="md:hidden z-50 ">
      <Sidebar
        triggerIcon={<Bars3Icon className="w-6 h-6 text-white" />}

        triggerClassName="fixed top-4 left-4 z-40 bg-primary-600 p-2 rounded-md shadow-md "
      >
        {props.children}
      </Sidebar>
    </div>
  );
};

export default MobileNavbar;
