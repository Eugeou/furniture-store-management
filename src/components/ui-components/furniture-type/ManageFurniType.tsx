"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Select, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { Furnitype } from "@/types/entities/furnitype-entity";
import { CreateFurnitype, DeleteFurnitype, EditFurnitype, GetAllFurnitype } from "@/services/furnitype-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";
import { RoomSpace } from "@/types/entities/roomspace-entity";
import { GetAllRoomSpace } from "@/services/roomspace-service";

const ManageFurniType: React.FC = () => {
    const { data: FurniTypes, mutate, isLoading } = useSWR<Furnitype[]>(
        envConfig.NEXT_PUBLIC_API_ENDPOINT + "/furnitureType",
        GetAllFurnitype,
        { fallbackData: [] }
    );
    const { data: RoomSpaces } = useSWR<RoomSpace[]>(
        envConfig.NEXT_PUBLIC_API_ENDPOINT + "/roomspace",
        GetAllRoomSpace,
        { fallbackData: [] }
    );

    const [form] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingFurniType, setEditingFurniType] = useState<Furnitype | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredFurniType = (FurniTypes ?? []).filter((FurniType) =>
        FurniType.FurnitureTypeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleAddFurniType = async () => {
        try {
            const values = await form.validateFields();
            await CreateFurnitype(values);
            mutate();
            toast.success("FurniType added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding FurniType");
        }
    };

    const handleEditFurniType = async () => {
        if (!editingFurniType) return;
        const values = await form.validateFields();
        try {
            await EditFurnitype(editingFurniType.Id, values);
            mutate();
            setEditingFurniType(null);
            setIsEditModalVisible(false);
            toast.success("FurniType updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating FurniType");
        }
    };

    const handleDeleteFurniType = async (furnitureTypeId: string) => {
        try {
            await DeleteFurnitype(furnitureTypeId);
            mutate();
            toast.success("FurniType deleted successfully");
        } catch (error) {
            toast.error("Error deleting FurniType");
        }
    };

    const columns = [
        {
            title: "FurniType Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text || "/faq.png"} alt="FurniType logo" className="w-10 h-10" />,
        },
        {
            title: "FurniType Name",
            key: "FurniTypeName",
            render: (_: any, record: Furnitype) => (
                <Tag color="orange">{record.FurnitureTypeName}</Tag>
            ),
        },
        {
            title: "Room Space",
            key: "RoomSpace",
            render: (_: any, record: Furnitype) => {
                const roomSpace = RoomSpaces?.find(rs => rs.Id === record.RoomSpaceId);
                return roomSpace ? (
                    <div className="flex items-center space-x-2">
                        <img src={roomSpace.ImageSource || "/faq.png"} alt="RoomSpace" className="w-8 h-8" />
                        <span>{roomSpace.RoomSpaceName}</span>
                    </div>
                ) : null;
            },
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        {
            title: "Edit",
            key: "edit",
            render: (_: any, record: Furnitype) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingFurniType(record);
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
            render: (_: any, record: Furnitype) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteFurniType(record.Id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    console.log("Form", form.validateFields);

    return (
        <div>
            <div className="flex justify-between items-center w-full mb-8">
                <Input
                    placeholder="Search by FurniType name"
                    prefix={<SearchIcon />}
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<BookmarkPlus />}
                    className="font-semibold shadow-lg h-10"
                    onClick={() => setIsAddModalVisible(true)}
                >
                    Add new FurniType
                </Button>
            </div>

            <Table
                dataSource={filteredFurniType}
                columns={columns}
                rowKey="Id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title="Add New FurniType"
                open={isAddModalVisible}
                onOk={handleAddFurniType}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="FurnitureTypeName" label="FurniType Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter FurniType name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className=' text-sm'>FurniType Image</p>}>
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
                    <Form.Item name="RoomSpaceId" label="Room Space" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select Room Space"
                            options={RoomSpaces?.map(room => ({
                                value: room.Id,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={room.ImageSource || "/faq.png"} alt="RoomSpace" className="w-6 h-6" />
                                        <span>{room.RoomSpaceName}</span>
                                    </div>
                                ),
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit FurniType"
                open={isEditModalVisible}
                onOk={handleEditFurniType}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="FurnitureTypeName" label="FurniType Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter FurniType name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className=' text-sm'>FurniType Image</p>}>
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
                    <Form.Item name="RoomSpaceId" label="Room Space" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select Room Space"
                            options={RoomSpaces?.map(room => ({
                                value: room.Id,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={room.ImageSource || "/faq.png"} alt="RoomSpace" className="w-6 h-6" />
                                        <span>{room.RoomSpaceName}</span>
                                    </div>
                                ),
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageFurniType;
