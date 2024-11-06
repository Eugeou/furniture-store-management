"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon } from "lucide-react";
import { Brand } from "@/types/entities/brand-entity";
import { CreateBrand, DeleteBrand, EditBrand, GetAllBrand } from "@/services/brand-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";

const ManageBrand: React.FC = () => {
    const { data: brands , mutate } = useSWR(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/brand", GetAllBrand, { fallbackData: [] });
    const [form] = Form.useForm();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredBrands = (brands as any).data?.filter((brand: { BrandName: string; }) =>
        brand.BrandName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

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
            title: "Brand Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text ? text : "/faq.png"} alt="brand logo" className="w-10 h-10" />,
        },
        {
            title: "Brand Name",
            // dataIndex: "BrandName",
            key: "BrandName",
            render: (_: any, record: Brand) => (
                <Tag color="blue">{record.BrandName}</Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        
        {
            title: "Edit Brand",
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

    //console.log(brands);

    return (
        <div>
            
            <div className="flex justify-between items-center w-full mb-8">
                <Input 
                    placeholder="Search by brand name" 
                    prefix={<SearchIcon />} 
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" onClick={() => setIsAddModalVisible(true)}>
                    Add new Brand
                </Button>
            </div>

            <Table
                dataSource={filteredBrands} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Add New Brand</p></div>}
                open={isAddModalVisible}
                onOk={handleAddBrand}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="BrandName" label={<p className='font-semibold text-sm'>Brand Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter brand name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Brand Image</p>}>
                        <Upload beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Edit Brand</p></div>}
                open={isEditModalVisible}
                onOk={handleEditBrand}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="BrandName" label={<p className='font-semibold text-sm'>Brand Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter brand name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Brand Image</p>}>
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
