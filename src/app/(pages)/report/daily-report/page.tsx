import React from "react";

import { ChartArea } from "lucide-react";
import dynamic from "next/dynamic";

const DailyReport = dynamic(() => import("@/components/ui-components/report/DailyReport"), {
  ssr: false,
});

const ManageBrandPage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <ChartArea className="ml-5 flex text-lg font-bold text-center text-white" />
        <h3 className="space-y-0 font-semibold text-white">Daily Report</h3>
      </div>
      <DailyReport />
      
    </div>
  );
};

export default ManageBrandPage;
