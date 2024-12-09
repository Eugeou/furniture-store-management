"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { RoomSpace } from "@/types/entities/roomspace-entity";
import { CreateRoomSpace, DeleteRoomSpace, EditRoomSpace, GetAllRoomSpace } from "@/services/roomspace-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";

const ManageRoomSpace: React.FC = () => {
    const { data: RoomSpaces , mutate } = useSWR<RoomSpace[]>(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/roomspace", GetAllRoomSpace, { fallbackData: [] });
    const [form] = Form.useForm();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingRoomSpace, setEditingRoomSpace] = useState<RoomSpace | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredRoomSpaces = (RoomSpaces ?? []).filter((RoomSpace: { RoomSpaceName: string; }) =>
        RoomSpace.RoomSpaceName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );


    //console.log(localStorage.getItem("accessToken"), 'user id', localStorage.getItem("userId"));

    const handleAddRoomSpace = async () => {
        try {
            const values = await form.validateFields();
            await CreateRoomSpace(values);
            mutate(); 
            toast.success("RoomSpace added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding RoomSpace");
        }
    };

    const handleEditRoomSpace = async () => {
        if (!editingRoomSpace) return;
        const values = await form.validateFields();
        try {
            await EditRoomSpace(editingRoomSpace.Id, values);
            mutate(); 
            setEditingRoomSpace(null);
            setIsEditModalVisible(false);
            toast.success("RoomSpace updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating RoomSpace");
        }
    };

    const handleDeleteRoomSpace = async (roomSpaceId: string) => {
        try {
            await DeleteRoomSpace(roomSpaceId);
            mutate(); 
            toast.success("RoomSpace deleted successfully");
        } catch (error) {
            toast.error("Error deleting RoomSpace");
        }
    };

    const columns = [
        {
            title: "RoomSpace Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text ? text : "/faq.png"} alt="RoomSpace logo" className="w-10 h-10" />,
        },
        {
            title: "RoomSpace Name",
            // dataIndex: "RoomSpaceName",
            key: "RoomSpaceName",
            render: (_: any, record: RoomSpace) => (
                <Tag color="orange">{record.RoomSpaceName}</Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        
        {
            title: "Edit RoomSpace",
            key: "edit",
            render: (_: any, record: RoomSpace) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingRoomSpace(record);
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
            render: (_: any, record: RoomSpace) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteRoomSpace(record.Id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    //console.log(RoomSpaces);

    return (
        <div>
            
            <div className="flex justify-between items-center w-full mb-8">
                <Input 
                    placeholder="Search by RoomSpace name" 
                    prefix={<SearchIcon />} 
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" onClick={() => setIsAddModalVisible(true)}>
                    Add new RoomSpace
                </Button>
            </div>

            <Table
                dataSource={filteredRoomSpaces} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Add New RoomSpace</p></div>}
                open={isAddModalVisible}
                onOk={handleAddRoomSpace}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="RoomSpaceName" label={<p className='font-semibold text-sm'>RoomSpace Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter RoomSpace name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    {/* <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>RoomSpace Image</p>}>
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
                title={<div className="flex justify-center items-center space-x-2"><Tags /> <p className="font-semibold text-xl">Edit RoomSpace</p></div>}
                open={isEditModalVisible}
                onOk={handleEditRoomSpace}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="RoomSpaceName" label={<p className='font-semibold text-sm'>RoomSpace Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter RoomSpace name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>RoomSpace Image</p>}>
                        <Upload beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default ManageRoomSpace;
