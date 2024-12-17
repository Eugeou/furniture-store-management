import React from "react";

import { Slack } from "lucide-react";
import dynamic from "next/dynamic";

const ManageCategory = dynamic(() => import("@/components/ui-components/category/ManageCategory"), {
  ssr: false,
});

const ManageCategoryPage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Slack className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white">Manage Category</h3>
      </div>
      <ManageCategory />
      
    </div>
  );
};

export default ManageCategoryPage;
