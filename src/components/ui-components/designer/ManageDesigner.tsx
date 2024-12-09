"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { Designer } from "@/types/entities/designer-entity";
import { CreateDesigner, DeleteDesigner, EditDesigner, GetAllDesigner } from "@/services/designer-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";

const ManageDesigner: React.FC = () => {
    const { data: Designers , mutate } = useSWR<Designer[]>(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/designer", GetAllDesigner, { fallbackData: [] });
    const [form] = Form.useForm();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingDesigner, setEditingDesigner] = useState<Designer | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredDesigners = (Designers ?? []).filter((Designer: { DesignerName: string; }) =>
        Designer.DesignerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );


    //console.log(localStorage.getItem("accessToken"), 'user id', localStorage.getItem("userId"));

    const handleAddDesigner = async () => {
        try {
            const values = await form.validateFields();
            await CreateDesigner(values);
            mutate(); 
            toast.success("Designer added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding Designer");
        }
    };

    const handleEditDesigner = async () => {
        if (!editingDesigner) return;
        const values = await form.validateFields();
        try {
            await EditDesigner(editingDesigner.Id, values);
            mutate(); 
            setEditingDesigner(null);
            setIsEditModalVisible(false);
            toast.success("Updated Designer information successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error while updating Designer information");
        }
    };

    const handleDeleteDesigner = async (designerId: string) => {
        try {
            await DeleteDesigner(designerId);
            mutate(); 
            toast.success("Designer information deleted successfully");
        } catch (error) {
            toast.error("Error deleting Designer information");
        }
    };

    const columns = [
        {
            title: "Designer Avatar",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text ? text : "/faq.png"} alt="Designer logo" className="w-10 h-10" />,
        },
        {
            title: "Designer Name",
            // dataIndex: "DesignerName",
            key: "DesignerName",
            render: (_: any, record: Designer) => (
                <Tag color="blue">{record.DesignerName}</Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        
        {
            title: "Edit Designer info",
            key: "edit",
            render: (_: any, record: Designer) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingDesigner(record);
                        form.setFieldsValue(record);
                        setIsEditModalVisible(true);
                    }}
                >
                    Edit
                </Button>
            ),
        },
        {
            title: "Delete Designer info",
            key: "delete",
            render: (_: any, record: Designer) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteDesigner(record.Id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    //console.log(Designers);

    return (
        <div>
            
            <div className="flex justify-between items-center w-full mb-8">
                <Input 
                    placeholder="Search by Designer name" 
                    prefix={<SearchIcon />} 
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" onClick={() => setIsAddModalVisible(true)}>
                    Add new Designer info
                </Button>
            </div>

            <Table
                dataSource={filteredDesigners} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Add New Designer</p></div>}
                open={isAddModalVisible}
                onOk={handleAddDesigner}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="DesignerName" label={<p className='font-semibold text-sm'>Designer Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter Designer name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    {/* <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Designer Image</p>}>
                        <Upload 
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button className="border-none text-gray-300" icon = {<UploadIcon />}/>
                        </Upload>
                    </Form.Item> */}

                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Designer Avatar</p>}>

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

                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Edit Designer</p></div>}
                open={isEditModalVisible}
                onOk={handleEditDesigner}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="DesignerName" label={<p className='font-semibold text-sm'>Designer Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter Designer name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Designer Avatar</p>}>

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

                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default ManageDesigner;
