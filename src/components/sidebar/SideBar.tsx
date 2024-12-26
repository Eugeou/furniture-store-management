"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Users, UserPlus, ChevronDown, ChevronLeft, ChevronRight, Package, PackageOpen, TicketPercent, CalendarHeart, BookUser, ScrollText, Import, PieChart, Blocks, ListOrdered, FilePlus, LineChart, TrendingUp, Sofa, Proportions, WandSparkles, UserCog, BookUserIcon } from 'lucide-react';
import { LayoutDashboardIcon } from 'lucide-react';
import { Tags, Slack } from 'lucide-react';
import { BgColorsOutlined } from '@ant-design/icons';
//import { useRouter } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  //const router = useRouter();
  
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log(storedRole);
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleDropdownClick = (menu: string) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenDropdown(null); // Close all dropdowns when collapsing sidebar
    }
  };

  return (
    <div className={`fixed left-0 top-0 overflow-y-auto bg-white shadow-2xl border border-slate-200 rounded-2xl text-green-900 ${isCollapsed ? 'w-20' : 'w-64'} h-full fixed flex flex-col transition-all duration-300`}>
      <div className="flex justify-between items-center p-4">
        
        {!isCollapsed && 
        <div className="text-2xl font-bold">
          FurniStore
        </div>}
        <button onClick={handleCollapseClick} className="text-gray-100 bg-green-800 h-8 w-8 rounded-lg shadow-xl">
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {/* Only render for Owner */}
          {role === 'Owner' && (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-800">
                <LayoutDashboardIcon className="mr-2" />
                {!isCollapsed && <Link href="/pages/dashboard">Dashboard</Link>}
              </li>

              {/*Category Link */}
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('category')}>
                <div className="flex items-center cursor-pointer">
                  <Sofa className="mr-2" />
                  {!isCollapsed && 'Furniture type'}
                </div>
                {!isCollapsed && (
                  <div className={`transform transition-transform duration-300 ${openDropdown === 'category' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown />
                  </div>
                )}
              </li>

              <ul
                className={`pl-8 m-2 transition-max-height duration-300 ease-in-out overflow-hidden ${
                  openDropdown === 'category' && !isCollapsed ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <Tags  className="mr-2" />
                  <Link href="/brand">Brands</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <Proportions className="mr-2" />
                  <Link href="/roomspace">Room Space</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <Slack className="mr-2" />
                  <Link href="/category">Category</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <Sofa className="mr-2" />
                  <Link href="/furniture-type">Furniture Type</Link>
                </li>
              </ul>
            </>
          )}

          {/* Product Link */}
          {role === 'Owner' || role === 'Staff' ? (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('product')}>
                <div className="flex items-center cursor-pointer">
                  <Package className="mr-2" />
                  {!isCollapsed && 'Products'}
                </div>
                {!isCollapsed && (
                  <div className={`transform transition-transform duration-300 ${openDropdown === 'product' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown />
                  </div>
                )}
              </li>

              <ul
                className={`pl-8 m-2 transition-max-height duration-300 ease-in-out overflow-hidden ${
                  openDropdown === 'product' && !isCollapsed ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <BgColorsOutlined  className="mr-2" />
                  <Link href="/color">Colors</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <Blocks className="mr-2" />
                  <Link href="/material">Materials</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <WandSparkles className="mr-2" />
                  <Link href="/designer">Designer</Link>
                </li>
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <PackageOpen className="mr-2" />
                  <Link href="/product/list-product">Products list</Link>
                </li>
              </ul>


              {/*Imports Link */}
            <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('invoices')}>
              <div className="flex items-center cursor-pointer">
                <Import className="mr-2" />
                {!isCollapsed && 'Import'}
              </div>
              {!isCollapsed && (
                <div className={`transform transition-transform duration-300 ${openDropdown === 'invoices' ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown />
                </div>
              )}
            </li>
            <ul
              className={`pl-8 m-2 transition-max-height duration-300 ease-in-out focus:outline-none  overflow-hidden ${
                openDropdown === 'invoices' && !isCollapsed ? 'max-h-64' : 'max-h-0'
              }`}
            >
              <li className=" p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-amber-800">
                <ScrollText className="mr-2 rounded-md" />
                <Link href="/pages/imports/list-imports">List invoices</Link>
              </li>
              
              <li className=" p-2  rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
                <Blocks className="mr-2" />
                <Link href="/pages/imports/add-import">Import products</Link>
              </li>
            </ul>
            </>
          ) : null}

          {/* Events Link */}
          {role === 'Owner' || role === 'Staff' ? (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('events')}>
                <div className="flex items-center cursor-pointer">
                  <CalendarHeart className="mr-2" />
                  {!isCollapsed && 'Events'}
                </div>
                {!isCollapsed && (
                  <div className={`transform transition-transform duration-300 ${openDropdown === 'events' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown />
                  </div>
                )}
              </li>

              <ul
                className={`pl-8 m-2 transition-max-height duration-300 ease-in-out overflow-hidden ${
                  openDropdown === 'events' && !isCollapsed ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <li className="p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-green-900">
                  <TicketPercent  className="mr-2" />
                  <Link href="/coupon">Coupons</Link>
                </li>
              </ul>
            </>
          ) : null}

          {/* Customers Link */}
          {role === 'Owner' || role === 'Staff' ? (
            <>
              

            <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('customers')}>
              <div className="flex items-center cursor-pointer">
                <Users className="mr-2" />
                {!isCollapsed && 'Customers'}
              </div>
              {!isCollapsed && (
                <div className={`transform transition-transform duration-300 ${openDropdown === 'customers' ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown />
                </div>
              )}
            </li>
            <ul
              className={`pl-8 m-2 transition-max-height duration-300 ease-in-out focus:outline-none  overflow-hidden ${
                openDropdown === 'customers' && !isCollapsed ? 'max-h-64' : 'max-h-0'
              }`}
            >
              <li className=" p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-amber-800">
                <FileText className="mr-2 rounded-md" />
                <Link href="/customer/list-customer">Customers List</Link>
              </li>
              
              <li className=" p-2  rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
                <UserPlus className="mr-2" />
                <Link href="/pages/manage-customers/add-customer">Add Customer</Link>
              </li>
            </ul>
            </>
          ) : null}

          {/* Staffs Link */}
          {role === 'Owner' ? (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('users')}>
                <div className="flex items-center cursor-pointer">
                  <BookUserIcon className="mr-2" />
                  {!isCollapsed && 'Staffs'}
                </div>
                {!isCollapsed && (
                  <div className={`transform transition-transform duration-300 ${openDropdown === 'users' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown />
                  </div>
                )}
              </li>
              <ul
                className={`pl-8 m-2 transition-max-height duration-300 ease-in-out focus:outline-none  overflow-hidden ${
                  openDropdown === 'users' && !isCollapsed ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <li className=" p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-amber-800">
                  <BookUser className="mr-2 rounded-md" />
                  <Link href="/Staff/list-Staff">Staffs List</Link>
                </li>
                
                <li className=" p-2  rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
                  <UserPlus className="mr-2" />
                  <Link href="/Staff/add-Staff">Add Staff</Link>
                </li>
              </ul>
            </>
          ) : null}

          {/* Orders Link */}
          {role === 'Owner' || role === 'Staff' ? (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('orders')}>
            <div className="flex items-center cursor-pointer">
              <ListOrdered className="mr-2" />
              {!isCollapsed && 'Orders'}
            </div>
            {!isCollapsed && (
              <div className={`transform transition-transform duration-300 ${openDropdown === 'orders' ? 'rotate-180' : 'rotate-0'}`}>
                <ChevronDown />
              </div>
            )}
          </li>
          <ul
            className={`pl-8 m-2 transition-max-height duration-300 ease-in-out focus:outline-none  overflow-hidden ${
              openDropdown === 'orders' && !isCollapsed ? 'max-h-64' : 'max-h-0'
            }`}
          >
            <li className=" p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-amber-800">
              <ListOrdered className="mr-2 rounded-md" />
              <Link href="/pages/orders/list-orders">List orders</Link>
            </li>
            
            <li className=" p-2  rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
              <FilePlus className="mr-2" />
              <Link href="/pages/orders/create-order">Create order</Link>
            </li>
          </ul>
            </>
          ) : null}

          {/* Reports Link */}
          {role === 'Owner' ? (
            <>
              <li className="p-4 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center justify-between transition duration-500 ease-out focus:outline-none active:bg-green-900" onClick={() => handleDropdownClick('reports')}>
              <div className="flex items-center cursor-pointer">
                <PieChart className="mr-2" />
                {!isCollapsed && 'Reports'}
              </div>
              {!isCollapsed && (
                <div className={`transform transition-transform duration-300 ${openDropdown === 'reports' ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown />
                </div>
              )}
            </li>
            <ul
              className={`pl-8 m-2 transition-max-height duration-300 ease-in-out focus:outline-none  overflow-hidden ${
                openDropdown === 'reports' && !isCollapsed ? 'max-h-64' : 'max-h-0'
              }`}
            >
              <li className=" p-2 mb-2 mt-2 left-3 rounded-lg hover:bg-green-800 hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-amber-800">
                <ListOrdered className="mr-2 rounded-md" />
                <Link href="/pages/reports/daily-report">Daily reports</Link>
              </li>
              
              <li className=" p-2 mb-2 rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
                <LineChart className="mr-2" />
                <Link href="/pages/reports/monthly-report">Monthly reports</Link>
              </li>

              <li className=" p-2  rounded-lg hover:bg-green-800 group hover:text-white font-semibold flex items-center transition duration-500 ease-out focus:outline-none active:bg-slate-900">
                <TrendingUp className="mr-2" />
                <Link href="/pages/reports/yearly-report">Yearly reports</Link>
              </li>
              </ul>
            </>
          ) : null}

          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
