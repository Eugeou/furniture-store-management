import React from "react";

import { Proportions } from "lucide-react";
import dynamic from "next/dynamic";

const ManageRoomSpace = dynamic(() => import("@/components/ui-components/roomspace/ManageRoomSpace"), {
  ssr: false,
});

const ManageRoomSpacePage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Proportions className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white ">Manage Room Space</h3>
      </div>
      <ManageRoomSpace />
      
    </div>
  );
};

export default ManageRoomSpacePage;
