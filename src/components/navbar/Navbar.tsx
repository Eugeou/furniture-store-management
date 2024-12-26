"use client";
import React, { use, useEffect, useState } from 'react';
import { Button, Dropdown, Menu, Modal, Avatar, notification } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, QuestionCircleOutlined, DashboardOutlined, CalendarOutlined } from '@ant-design/icons';


import { logout } from '@/services/auth-service';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';



const Navbar: React.FC = () => {
    //const [user, setUser] = useState<UserProps | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //const [searchResults, setSearchResults] = useState<string[]>([]);
    const [revenue, setRevenue] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: session } = useSession();
    const user = session?.user;
    //console.log('userId', user?.id);
    //console.log('role', user?.user.Role);
    
    useEffect(() => {
        localStorage.setItem('role', user?.user.Role || '');
    }, [user]);
     console.log('role: ', localStorage.getItem('role'));

    

    const handleRevenue = () => {
        let storedValue: string | null = localStorage.getItem('revenue');
        setRevenue(storedValue);
        setIsModalVisible(true);
    }

    const handleLogout = async () => {
        const userId = user?.id;
        if (userId) {
            setLoading(true);
            try {
                await logout(userId);
                //localStorage.clear();
                window.location.href = "/login";
                sessionStorage.clear();
                toast.success("Logout successfully");
                setLoading(false);
            } catch (error) {
                notification.error({ message: 'Logout failed' });
            }
        }
    };

    // const handleSearch = (value: string) => {
    //     // Simulate search results based on the input value
    //     const results = [
    //         "Manage Users",
    //         "Add User",
    //         "Add Product",
    //         "Manage Products",
    //         "Manage Customers",
    //         "Dashboard",
    //     ].filter(item => item.toLowerCase().includes(value.toLowerCase()));

    //     setSearchResults(results);
    // };

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                <span className='text-green-800'>{user?.user.FullName}</span>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link href="/profile">Your Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                <Link href={`/setting/${user?.id}`}>Settings</Link>
            </Menu.Item>
            <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                <Link href="/help">Help</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Sign out
            </Menu.Item>
        </Menu>
    );

    const shortcutsMenu = (
        <Menu>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
                <Link href="/staff/list-staff">Users</Link>
            </Menu.Item>

            <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                <Link href="/calendar">Calendar</Link>
            </Menu.Item>
            {/* Add more shortcut items here */}
        </Menu>
    );

    return (
        <div className="fixed top-0 w-full flex items-start justify-around rounded-xl border border-gray-300 shadow-md p-4 z-10 h-16" style={{ backgroundColor: "#3b5d50" }}>
            <Button className=' mr-96' onClick={handleRevenue}>My session revenue</Button>
            <Modal className='flex justify-center items-center text-center text-lg'
                title= {<h1>{revenue} VND</h1>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                
            >

            </Modal>
            <Dropdown overlay={shortcutsMenu} placement="bottomLeft" arrow>
                <Button icon={<DashboardOutlined />} />
            </Dropdown>
            <Dropdown className=' mr-52 border-2 border-gray-500 bg-white rounded-full justify-start items-center w-20 ' overlay={userMenu} placement="bottomLeft" arrow >
                <div className="flex items-center cursor-pointer">
                    <Avatar src={user?.user.ImageSource || "/nextjs-logo.jpg"} />
                    {/* <span className="ml-2 text-nowrap text-yellow-800 font-semibold">{user?.user.FullName}</span> */}
                </div>
            </Dropdown>
        </div>
    );
};

export default Navbar;
