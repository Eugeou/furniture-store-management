import React from "react";

import { Ticket } from "lucide-react";
import dynamic from "next/dynamic";



const ManageSize = dynamic(() => import("@/components/ui-components/size/ManageSize"), {
  ssr: false,
});

const ManageOrderPage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Ticket className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white">Manage Sizes</h3>
      </div>
      <ManageSize />
      
    </div>
  );
};

export default ManageOrderPage;