"use client";

import { useEffect, useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, Users, RefreshCcw, Eye, Search, PencilIcon, Trash, BookmarkPlus } from 'lucide-react';
import { Table, Button, Menu, Dropdown, Select, Input, Image, Tag } from 'antd';
import useSWR from 'swr';
import useDebounce from '@/hooks/useDebounce';

import { CustomerEntity } from '@/types/entities/customer-entity';
import { GetAllCustomers, DeleteCustomer } from '@/services/customer-service';

import { toast } from 'react-toastify';
import DetailDrawer from '@/components/shared/drawer/DetailDrawer';


const ManageCustomers: React.FC = () => {
  const { data: users, mutate, isLoading } = useSWR<CustomerEntity[]>('/customer', GetAllCustomers, { fallbackData: [] });
  
  const [selectedUser, setSelectedUser] = useState<CustomerEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredCustomers = (users ?? []).filter((user: { FullName: string }) =>
    user.FullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );


  

  const handleDelete = async (userId: string) => {
    try {
      await DeleteCustomer(userId);
      mutate();
      toast.success('Delete user success');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleView = (user: CustomerEntity) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEdit = (userId: string) => {
    window.location.href = `/pages/manage-customers/${userId}`;
  };


  const columns = [
    {
      title: 'Customer',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string, user: CustomerEntity) => (
        <div className="flex items-center">
          {user.ImageSource ? (
            <Image className="h-10 w-10 rounded-full" src={user.ImageSource} alt="" />
          ) : (
            <span className="inline-block h-10 w-10 rounded-full bg-gray-200"></span>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.FullName}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Phone number',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
        title: 'Birthday',
        dataIndex: 'DateOfBirth',
        key: 'DateOfBirth',
    },
    {
        title: 'Status',
        key: 'IsLocked',
        render: (_: unknown, user: CustomerEntity) => (
            <Tag color={user.IsLocked ? 'red' : 'green'}>{user.IsLocked ? 'Banned' : 'Active'}</Tag>
        )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, user: CustomerEntity) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleView(user)}>
                <div className='flex flex-row justify-start items-center space-y-0 space-x-1'>
                  <Eye className="mr-2 font-semibold" width={20} height={20} /> 
                  <p>View</p>
                </div>
                
              </Menu.Item>
              <Menu.Item onClick={() => handleEdit(user.Id)}>
              <div className='flex flex-row justify-start items-center space-y-0 space-x-1'>
                <PencilIcon className="mr-2 font-semibold" width={20} height={20} /> 
                <p>Edit</p>
              </div>
              </Menu.Item>
              <Menu.Item onClick={() => handleDelete(user.Id)}>
              <div className='flex flex-row justify-start items-center space-y-0 space-x-1'>
                <Trash className="mr-2 font-semibold" width={20} height={20} /> 
                <p>Delete</p>
              </div>
              </Menu.Item>
            </Menu>
          }
        >
          <Button className='flex flex-row space-y-0 space-x-1'>
            Actions <ChevronDown />
          </Button>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <div className=" flex flex-row space-x-2 space-y-0 mt-4 w-full justify-between">
        <Input 
          className="focus:placeholder-transparent focus:border-blue-500 mb-8 w-2/3 h-10 border border-gray-400 rounded-lg shadow-lg" 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name"
          size="middle"
          prefix={<Search />}
        />

        <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" onClick={() => window.location.href = '/customer/add-customer'}>
            Add new Customer
        </Button>
        
      </div>

      <Table
        dataSource={filteredCustomers}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        className="min-w-full rounded-lg shadow-sm border border-gray-300"
        bordered
      />

      <DetailDrawer user={selectedUser} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default ManageCustomers;
