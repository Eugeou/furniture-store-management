"use client";
import Navbar from "@/components/navbar/Navbar";
// import { Inter } from "next/font/google";
import "../globals.css";
// import Navbar from "@/src/components/Navbar";
import Sidebar from "@/components/sidebar/SideBar";
import { useSidebarState } from "@/hooks/useTransitions";

// const inter = Inter({ subsets: ["latin"] });


export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSidebarCollapsed, toggleSidebar } = useSidebarState();

  return (
        <div className="flex bg-indigo-100 rounded-3xl ">
          
          <aside className={`h-screen bg-indigo-100 rounded-3xl text-white transition-all ${isSidebarCollapsed ? 'w-10' : ' w-16'}`}>
            
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={toggleSidebar}/>
            
          </aside>
          
          <div className={`flex-1 flex flex-col p-4 transition-all bg-indigo-100 ${isSidebarCollapsed ? 'ml-10' : 'ml-52'} mt-16`}>
          <Navbar />
            {children}
          </div>
        </div>
  );
}