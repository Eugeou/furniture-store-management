import React  from 'react';

import { BgColorsOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

//Dynamic import ManageColor component
const ManageColor = dynamic(() => import('@/components/ui-components/color/ManageColor'), {
    ssr: false,
});


const ManageColorPage: React.FC = () => {

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl" >
        <div className="flex space-y-0 mb-8 ml-0 border border-gray-300 space-x-2 justify-center items-center bg-white rounded-xl shadow-xl w-full h-12"> 
          <BgColorsOutlined  className="ml-5 flex text-lg font-bold text-center text-indigo-600" />
          <h3 className="space-y-0 font-semibold">Manage Color</h3>
        </div>
        <ManageColor/>

    </div>
  );
};

export default ManageColorPage;
