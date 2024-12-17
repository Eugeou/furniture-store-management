import React from 'react';

import { Users } from 'lucide-react';
import dynamic from 'next/dynamic';


//Dynamic import ManageUsers component
const ManageStaffs = dynamic(() => import('@/components/ui-components/staff/ManageStaff'), {
  ssr: false
});

const ManageUsersPage: React.FC = () => {
  

  return (
    <div className="p-4 bg-white shadow-2xl border border-gray-200 h-full w-full rounded-3xl">
      <div className="flex space-y-0 mb-6 ml-0 border border-gray-300 space-x-2 items-center justify-center rounded-xl shadow-xl w-full h-12" style={{backgroundColor: "#3b5d50"}}> 
        <Users className="ml-5 flex text-lg font-bold text-center text-white"/>
        <h3 className=" space-y-0 font-semibold text-white">Manage Staffs</h3>
      </div>

      <ManageStaffs />
    </div>
  );
};

export default ManageUsersPage;
