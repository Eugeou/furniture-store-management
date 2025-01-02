"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import Image from 'next/image';
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { Brand } from "@/types/entities/brand-entity";
import { CreateBrand, DeleteBrand, EditBrand, GetAllBrand } from "@/services/brand-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";

const ManageBrand: React.FC = () => {
    const { data: brands , mutate } = useSWR<Brand[]>(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/brand", GetAllBrand, { fallbackData: [] });
    const [form] = Form.useForm();

    console.log('access token', localStorage.getItem("accessToken"));
    console.log('role', localStorage.getItem("role"));

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredBrands = (brands ?? []).filter((brand: { BrandName: string; }) =>
        brand.BrandName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );


    // const Loops = async () => {
    //     const data = await GetAllBrand();
    //     data.map(async (item) => {
    //         await DeleteBrand(item.Id);
    //     });

    //     data.forEach(async (item) => {
    //         await DeleteBrand(item.Id);
    //     });
        
    // }

    // filteredBrands.map(async (item) => {
    //     await DeleteBrand(item.Id);
    // });

    //console.log(localStorage.getItem("accessToken"), 'user id', localStorage.getItem("userId"));

    const handleAddBrand = async () => {
        try {
            const values = await form.validateFields();
            await CreateBrand(values);
            mutate(); 
            toast.success("Brand added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding brand " + error);
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
            toast.error("Error updating brand " + error);
        }
    };

    const handleDeleteBrand = async (brandId: string) => {
        try {
            await DeleteBrand(brandId);
            mutate(); 
            toast.success("Brand deleted successfully");
        } catch (error) {
            toast.error("Error deleting brand " + error);
        }
    };

    const columns = [
        {
            title: "Brand Image",
            dataIndex: "ImageSource",
            render: (text: string) => <Image src={text ? text : "/faq.png"} alt="brand logo" width={40} height={40} className="w-10 h-10" />,
        },
        {
            title: "Brand Name",
            // dataIndex: "BrandName",
            key: "BrandName",
            render: (_: unknown, record: Brand) => (
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
            render: (_: unknown, record: Brand) => (
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
            render: (_: unknown, record: Brand) => (
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
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" style={{backgroundColor: "#3b5d50"}} onClick={() => setIsAddModalVisible(true)}>
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
                    {/* <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Brand Image</p>}>
                        <Upload 
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button className="border-none text-gray-300" icon = {<UploadIcon />}/>
                        </Upload>
                    </Form.Item> */}

                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={() => false} // Ngăn việc upload tự động
                        onChange={({ fileList }) => {
                            if (fileList.length > 0) {
                                form.setFieldsValue({ ImageSource: fileList[0]?.originFileObj }); // Lưu file gốc
                            } else {
                                form.setFieldsValue({ ImageSource: null }); // Xóa nếu không có file
                            }
                        }}
                    >
                        <Button icon={<UploadIcon />}></Button>
                    </Upload>
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

