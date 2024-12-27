import React from "react";

import { Blocks, Tags } from "lucide-react";
import dynamic from "next/dynamic";

const ImportProducts = dynamic(() => import("@/components/ui-components/import/import-product/ImportProduct"), {
    ssr: false,
  });
const ManageBrandPage: React.FC = () => {


  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Blocks className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white">Import Product</h3>
      </div>
      <ImportProducts />

      
    </div>
  );
};

export default ManageBrandPage;
