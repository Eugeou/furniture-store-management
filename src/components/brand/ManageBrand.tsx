"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon } from "lucide-react";
import { Brand } from "@/types/entities/brand-entity";
import { CreateBrand, DeleteBrand, EditBrand, GetAllBrand } from "@/services/brand-service";
import envConfig from "@/configs/config";

const ManageBrand: React.FC = () => {
    const { data: brands , mutate } = useSWR(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/brand", GetAllBrand, { fallbackData: [] });
    const [form] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const handleAddBrand = async () => {
        try {
            const values = await form.validateFields();
            await CreateBrand(values);
            mutate(); 
            toast.success("Brand added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding brand");
        }
    };

    const handleEditBrand = async () => {
        if (!editingBrand) return;
        const values = await form.validateFields();
        try {
            await EditBrand(editingBrand.Id, values);
            mutate(); 
            setEditingBrand(null);
            setIsEditModalVisible(false);
            toast.success("Brand updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating brand");
        }
    };

    const handleDeleteBrand = async (brandId: string) => {
        try {
            await DeleteBrand(brandId);
            mutate(); 
            toast.success("Brand deleted successfully");
        } catch (error) {
            toast.error("Error deleting brand");
        }
    };

    const columns = [
        {
            title: "Brand Name",
            dataIndex: "BrandName",
            key: "BrandName",
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        {
            title: "Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text} alt="brand logo" className="w-10 h-10" />,
        },
        {
            title: "Edit",
            key: "edit",
            render: (_: any, record: Brand) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingBrand(record);
                        form.setFieldsValue(record);
                        setIsEditModalVisible(true);
                    }}
                >
                    Edit
                </Button>
            ),
        },
        {
            title: "Delete",
            key: "delete",
            render: (_: any, record: Brand) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteBrand(record.Id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    console.log(brands);

    return (
        <div>
            
            <div className="flex justify-between items-center w-full mb-6">
                <Input placeholder="Search by brand name" prefix={<SearchIcon />} className="w-2/3" />
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold" onClick={() => setIsAddModalVisible(true)}>
                    Add new Brand
                </Button>
            </div>

            <Table
                dataSource={(brands as any).data as Brand[]} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full"
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> Add new Brand</div>}
                open={isAddModalVisible}
                onOk={handleAddBrand}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="BrandName" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter brand name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label="Image">
                        <Upload beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<><Tags /> Edit Brand</>}
                open={isEditModalVisible}
                onOk={handleEditBrand}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="BrandName" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter brand name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label="Image">
                        <Upload beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default ManageBrand;
