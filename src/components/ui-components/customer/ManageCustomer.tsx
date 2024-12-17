"use client";

import { useState } from "react";
import { Table, Button, Menu, Dropdown, Select, Input, Image, Tag, Modal, Form } from "antd";
import { Eye, Search, PencilIcon, Trash, BookmarkPlus, ChevronDown, Ban, Unlock, Pen } from "lucide-react";
import useSWR from "swr";
import useDebounce from "@/hooks/useDebounce";
import { CustomerEntity, UpdateCustomer } from "@/types/entities/customer-entity";
import { GetAllCustomers, DeleteCustomer, EditCustomer, BanCustomer, UnBanCustomer } from "@/services/customer-service";
import { toast } from "react-toastify";
import DetailDrawer from "@/components/shared/drawer/DetailDrawer";

const ManageCustomers: React.FC = () => {
  const { data: users, mutate, isLoading } = useSWR<CustomerEntity[]>("/customer", GetAllCustomers, {
    fallbackData: [],
  });

  const [selectedUser, setSelectedUser] = useState<CustomerEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Filtered customers for search
  const filteredCustomers = (users ?? []).filter((user: { FullName: string }) =>
    user.FullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Handle Delete Customer
  const handleDelete = async (userId: string) => {
    try {
      await DeleteCustomer(userId);
      mutate();
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  // Handle View Details
  const handleView = (user: CustomerEntity) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  // Handle Edit Modal Open
  const handleEdit = (user: CustomerEntity) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    
    editForm.setFieldsValue({
      fullName: user.FullName,
      dateOfBirth: user.DateOfBirth,
      phoneNumber: user.PhoneNumber,
    });
  };

  // Submit Edit Form
  const handleEditSubmit = async () => {
    try {
      const updatedValues: UpdateCustomer = await editForm.validateFields();
      await EditCustomer(selectedUser?.Id ?? "", updatedValues);
      mutate();
      toast.success("Customer updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update customer: " + error);
    }
  };

  const handleBan = async (userId: string) => {
    try {
      await BanCustomer(userId);
      mutate();
      toast.success("Customer banned successfully!");
    } catch (error) {
      toast.error("Failed to ban customer: " + error);
    }
  };

const handleUnban = async (userId: string) => {
    try {
    await UnBanCustomer(userId);
    mutate();
    toast.success("Unbanned customer successfully!");
    } catch (error) {
    toast.error("Failed to unlock customer: " + error);
    }
};

  // Table Columns
  const columns = [
    {
      title: "Customer",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, user: CustomerEntity) => (
        <div className="flex items-center">
          {user.ImageSource ? (
            <Image className="h-10 w-10 rounded-full" src={user.ImageSource} alt="" />
          ) : (
            <span className="inline-block h-10 w-10 rounded-full bg-gray-200"></span>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 text-nowrap">{user.FullName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Birthday",
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      render: (date: string) => (
        <span className="text-gray-700">{new Date(date).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Status",
      key: "IsLocked",
      render: (_: unknown, user: CustomerEntity) => (
        <span>
            <Tag color={user.IsLocked ? "orange" : "green"}>{user.IsLocked ? "Banned" : "Active"}</Tag>
            <Tag color={user.IsDeleted ? "red" : "blue"}>{user.IsDeleted ? "Deleted" : "In use"}</Tag>
        </span>

      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, user: CustomerEntity) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleView(user)}>
                <Eye className="mr-2" width={18} height={18} /> View Details
              </Menu.Item>
              <Menu.Item onClick={() => handleEdit(user)}>
                <PencilIcon className="mr-2 text-indigo-500" width={18} height={18} /> Edit
              </Menu.Item>
              <Menu.Item onClick={() => handleDelete(user.Id)}>
                <Trash className="mr-2 text-red-500" width={18} height={18} /> Delete
              </Menu.Item>
                {user.IsLocked ? (
                    <Menu.Item onClick={() => handleUnban(user.Id)}>
                        <Unlock className="mr-2 text-green-500" width={18} height={18} /> Unlock
                    </Menu.Item>
                ) : (
                    <Menu.Item onClick={() => handleBan(user.Id)}>
                        <Ban className="mr-2 text-red-500" width={18} height={18} /> Ban customer
                    </Menu.Item>
                )}
            </Menu>
          }
        >
          <Button>
            Actions <ChevronDown />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {/* Search and Add New */}
      <div className="flex flex-row space-x-2 mt-4 justify-between mb-8">
        <Input
          placeholder="Search by customer name"
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<Search />}
          className="w-2/3"
        />
        <Button
          type="primary"
          icon={<BookmarkPlus />}
          onClick={() => (window.location.href = "/customer/add-customer")}
        >
          Add New Customer
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={filteredCustomers}
        columns={columns}
        loading={isLoading}
        rowKey="Id"
        pagination={{ pageSize: 6 }}
        bordered
      />

      {/* Detail Drawer */}
      <DetailDrawer user={selectedUser} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Edit Customer Modal */}
      <Modal
        title={<div className="flex justify-center items-center mt-2 mb-4 space-x-2 border-b border-gray-300 p-1"><Pen/> <h2>Edit Customer</h2></div>}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEditSubmit}
        okText="Save"
      >
        <Form form={editForm} layout="vertical" className="font-semibold">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter the full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select the date of birth" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCustomers;
