"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import Image from 'next/image';
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { Size } from "@/types/entities/size-entity";
import { CreateSize, DeleteSize, EditSize, GetAllSize } from "@/services/size-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";

const ManageSize: React.FC = () => {
    const { data: sizes , mutate } = useSWR<Size[]>(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/size", GetAllSize, { fallbackData: [] });
    const [form] = Form.useForm();

    // console.log('access token', localStorage.getItem("accessToken"));
    // console.log('role', localStorage.getItem("role"));

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredSizes = (sizes ?? []).filter((size: { SizeName: string; }) =>
        size.SizeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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

    const handleAddSize = async () => {
        try {
            const values = await form.validateFields();
            await CreateSize(values);
            mutate(); 
            toast.success("Size added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding Size " + error);
        }
    };

    const handleEditSize = async () => {
        if (!editingSize) return;
        const values = await form.validateFields();
        try {
            await EditSize(editingSize.Id, values);
            mutate(); 
            setEditingSize(null);
            setIsEditModalVisible(false);
            toast.success("Size updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating Size " + error);
        }
    };

    const handleDeleteSize = async (sizeId: string) => {
        try {
            await DeleteSize(sizeId);
            mutate(); 
            toast.success("Size deleted successfully");
        } catch (error) {
            toast.error("Error deleting Size " + error);
        }
    };

    const columns = [
        // {
        //     title: "Brand Image",
        //     dataIndex: "ImageSource",
        //     render: (text: string) => <Image src={text ? text : "/faq.png"} alt="brand logo" width={40} height={40} className="w-10 h-10" />,
        // },
        {
            title: "Size Name",
            // dataIndex: "BrandName",
            key: "SizeName",
            render: (_: unknown, record: Size) => (
                <Tag color="blue">{record.SizeName}</Tag>
            ),
        },
        {
            title: "Width",
            dataIndex: "Width",
            key: "Width",
        },
        
        {
            title: "Length",
            dataIndex: "Length",
            key: "Length",
        },
        
        {
            title: "Human Height",
            dataIndex: "HumanHeight",
            key: "HumanHeight",
        },
        
        {
            title: "Edit Size",
            key: "edit",
            render: (_: unknown, record: Size) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingSize(record);
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
            render: (_: unknown, record: Size) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteSize(record.Id)}
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
                    placeholder="Search by size name" 
                    prefix={<SearchIcon />} 
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" style={{backgroundColor: "#3b5d50"}} onClick={() => setIsAddModalVisible(true)}>
                    Add new Size
                </Button>
            </div>

            <Table
                dataSource={filteredSizes} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Add New Brand</p></div>}
                open={isAddModalVisible}
                onOk={handleAddSize}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="SizeName" label={<p className='font-semibold text-sm'>Size Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter size name" />
                    </Form.Item>
                    <Form.Item name="Width" label={<p className='font-semibold text-sm'>Width (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter width" />
                    </Form.Item>
                    <Form.Item name="Length" label={<p className='font-semibold text-sm'>Length (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter length" />
                    </Form.Item>
                    <Form.Item name="HumanHeight" label={<p className='font-semibold text-sm'>Human Height (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter human height" />
                    </Form.Item>
                    {/* <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Brand Image</p>}>
                        <Upload 
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button className="border-none text-gray-300" icon = {<UploadIcon />}/>
                        </Upload>
                    </Form.Item> */}

                    {/* <Upload
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
                    </Upload> */}
                </Form>
            </Modal>

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Edit Brand</p></div>}
                open={isEditModalVisible}
                onOk={handleEditSize}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="SizeName" label={<p className='font-semibold text-sm'>Size Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter size name" />
                    </Form.Item>
                    <Form.Item name="Width" label={<p className='font-semibold text-sm'>Width (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter width" />
                    </Form.Item>
                    <Form.Item name="Length" label={<p className='font-semibold text-sm'>Length (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter length" />
                    </Form.Item>
                    <Form.Item name="HumanHeight" label={<p className='font-semibold text-sm'>Human Height (cm)</p>}>
                        <Input type="number" min={0} placeholder="Enter human height" />
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default ManageSize;

