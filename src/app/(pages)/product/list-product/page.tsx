import React from "react";

import { Blocks } from "lucide-react";
import dynamic from "next/dynamic";


const ProductList = dynamic(() => import("@/components/ui-components/products/product-list/ProductList"), {
  ssr: false,
});

const ProductPage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center bg-white rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Blocks className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white">Product List</h3>
      </div>
      <ProductList />
      
    </div>
  );
};

export default ProductPage;
