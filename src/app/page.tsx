"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { ForwardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();
  // useEffect(() => {
  //   localStorage.setItem("role", "ADMIN");
  // }, []);

  return (
    <div className='flex flex-row min-h-screen justify-center items-center p-12 rounded-2xl' style={{backgroundColor: "#3b5d50"}}>
      
        <div className=' mt-10 ml-12  h-96 w-1/2 border border-gray-500 bg-white bg-opacity-20 rounded-3xl shadow-2xl'>
          <div className="mt-6 ml-6 w-3/4 flex rounded-2xl border-2 border-black  bg-white shadow-lg items-center justify-center ">
            <h1 className="m-4 text-3xl text-gray-700 font-semibold opacity-100">Welcome to Furni</h1>
            <ForwardOutlined className=" text-3xl"/>
          </div>

          <div className="mt-1 w-full h-52 flex justify-center items-center">
            <Image className="flex rounded-full border-2 border-white" src="/nextjs-logo.jpg" alt="Nextjs" width={100} height={100} />
            <Plus className=" text-white" width={60} height={60}/>
            <Image className="flex rounded-xl border-2 border-white" src="/ts-logo.png" alt="TypeScript" width={100} height={100} />
            <Plus className=" text-white" width={60} height={60}/>
            <Image className="flex rounded-full border-2 border-white" src="/tw-logo.jpg" alt="Taiwind" width={100} height={100} />
            <Plus className=" text-white" width={60} height={60}/>
            <Image className="flex rounded-xl border-2 border-white" src="/shadcn-logo.jpg" alt="Shadcn Ui" width={100} height={100} />
          </div>
          <Button className="ml-8 shadow-xl hover:bg-green-700 hover:border-gray-600 bg-white text-gray-700 font-semibold text-lg border-2 border-black w-36 h-14 rounded-xl" 
            icon={<ForwardOutlined />}
            type="default" color="default" onClick={() => router.push("/login")}>Get started
           </Button>
        
        </div>
        {/* <div className="flex mt-12 ml-8 justify-center items-center">
          <Image src="/bg-3.png" alt="bg" width={500} height={500} />
        </div> */}
    
    </div>
  );
}
