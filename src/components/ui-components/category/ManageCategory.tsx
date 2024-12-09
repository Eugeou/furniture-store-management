"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Select, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, UploadIcon } from "lucide-react";
import { Category } from "@/types/entities/category-entity";
import { CreateCategory, DeleteCategory, EditCategory, GetAllCategory } from "@/services/category-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";
import { Furnitype } from "@/types/entities/furnitype-entity";
import { GetAllFurnitype } from "@/services/furnitype-service";

const ManageCategory: React.FC = () => {
    const { data: Categories, mutate, isLoading } = useSWR<Category[]>(
        envConfig.NEXT_PUBLIC_API_ENDPOINT + "/category",
        GetAllCategory,
        { fallbackData: [] }
    );
    const { data: Furnitypes } = useSWR<Furnitype[]>(
        envConfig.NEXT_PUBLIC_API_ENDPOINT + "/furnitureType",
        GetAllFurnitype,
        { fallbackData: [] }
    );

    const [form] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredCategory = (Categories ?? []).filter((Category) =>
        Category.CategoryName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleAddCategory = async () => {
        try {
            const values = await form.validateFields();
            await CreateCategory(values);
            mutate();
            toast.success("Category added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error while adding Category");
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategory) return;
        const values = await form.validateFields();
        try {
            await EditCategory(editingCategory.Id, values);
            mutate();
            setEditingCategory(null);
            setIsEditModalVisible(false);
            toast.success("Category updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating Category");
        }
    };

    const handleDeleteCategory = async (furnitureTypeId: string) => {
        try {
            await DeleteCategory(furnitureTypeId);
            mutate();
            toast.success("Category deleted successfully");
        } catch (error) {
            toast.error("Error deleting Category");
        }
    };

    const columns = [
        {
            title: "Category Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text || "/faq.png"} alt="Category logo" className="w-10 h-10" />,
        },
        {
            title: "Category Name",
            key: "CategoryName",
            render: (_: any, record: Category) => (
                <Tag color="orange">{record.CategoryName}</Tag>
            ),
        },
        {
            title: "Room Space",
            key: "RoomSpace",
            render: (_: any, record: Category) => {
                const furnitypes = Furnitypes?.find((furnitype) => furnitype.Id === record.FurnitureTypeId);
                return furnitypes ? (
                    <div className="flex items-center space-x-2">
                        <img src={furnitypes.ImageSource || "/faq.png"} alt="RoomSpace" className="w-8 h-8" />
                        <span>{furnitypes.FurnitureTypeName}</span>
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
            render: (_: any, record: Category) => (
                <Button
                    icon={<Pen />}
                    onClick={() => {
                        setEditingCategory(record);
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
            render: (_: any, record: Category) => (
                <Button
                    icon={<Trash />}
                    danger
                    onClick={() => handleDeleteCategory(record.Id)}
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
                    placeholder="Search by Category name"
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
                    Add new Category
                </Button>
            </div>

            <Table
                dataSource={filteredCategory}
                columns={columns}
                rowKey="Id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-xl font-semibold"
                bordered
            />

            <Modal
                title="Add New Category"
                open={isAddModalVisible}
                onOk={handleAddCategory}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="CategoryName" label="Category Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter Category name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className=' text-sm'>Category Image</p>}>
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
                    <Form.Item name="FurnitureTypeId" label="Furniture Type" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select Furniture Type"
                            options={Furnitypes?.map(furnitype => ({
                                value: furnitype.Id,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={furnitype.ImageSource || "/faq.png"} alt="Furniture Type" className="w-6 h-6" />
                                        <span>{furnitype.FurnitureTypeName}</span>
                                    </div>
                                ),
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Category"
                open={isEditModalVisible}
                onOk={handleEditCategory}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="CategoryName" label="Category Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter Category name" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className=' text-sm'>Category Image</p>}>
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
                    <Form.Item name="FurnitureTypeId" label="Furniture Type" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select Furniture Type"
                            options={Furnitypes?.map(room => ({
                                value: room.Id,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={room.ImageSource || "/faq.png"} alt="Furniture Type" className="w-6 h-6" />
                                        <span>{room.FurnitureTypeName}</span>
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

export default ManageCategory;
