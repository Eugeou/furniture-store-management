"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, Button, Modal, Form, Input, Upload, Tag } from "antd";
import { toast } from "react-toastify";
import { BookmarkPlus, Pen, Tags, Trash, SearchIcon, Delete, UploadIcon, Blocks } from "lucide-react";

import { CreateMaterial, DeleteMaterial, EditMaterial, GetAllMaterial } from "@/services/material-service";
import envConfig from "@/configs/config";
import useDebounce from "@/hooks/useDebounce";
import { Material } from "@/types/entities/material-entity";

const ManageMaterial: React.FC = () => {
    const { data: materials , mutate } = useSWR(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/material", GetAllMaterial, { fallbackData: [] });
    const [form] = Form.useForm();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Material | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredMaterials = (materials as any).data?.filter((material: { MaterialName: string; }) =>
        material.MaterialName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleAddMaterial = async () => {
        try {
            const values = await form.validateFields();
            await CreateMaterial(values);
            mutate(); 
            toast.success("Material added successfully");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error adding material");
        }
    };

    const handleEditMaterial = async () => {
        if (!editingBrand) return;
        const values = await form.validateFields();
        try {
            await EditMaterial(editingBrand.Id, values);
            mutate(); 
            setEditingBrand(null);
            setIsEditModalVisible(false);
            toast.success("Material updated successfully");
            form.resetFields();
        } catch (error) {
            toast.error("Error updating material");
        }
    };

    const handleDeleteBrand = async (materialId: string) => {
        try {
            await DeleteMaterial(materialId);
            mutate(); 
            toast.success("Material deleted successfully");
        } catch (error) {
            toast.error("Error deleting material");
        }
    };

    const columns = [
        {
            title: "Material Image",
            dataIndex: "ImageSource",
            key: "ImageSource",
            render: (text: string) => <img src={text ? text : "/faq.png"} alt="Material Image" className="w-10 h-10 border border-gray-300 rounded-lg " />,
        },
        {
            title: "Material Name",
            // dataIndex: "BrandName",
            key: "MaterialName",
            render: (_: any, record: Material) => (
                <Tag color="orange">{record.MaterialName}</Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
        },
        
        {
            title: "Edit Material",
            key: "edit",
            render: (_: any, record: Material) => (
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
            render: (_: any, record: Material) => (
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
                    placeholder="Search by material name" 
                    prefix={<SearchIcon />} 
                    className="w-2/3 h-10 border border-gray-300 rounded-lg shadow-lg" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button type="primary" icon={<BookmarkPlus />} className="font-semibold shadow-lg h-10" onClick={() => setIsAddModalVisible(true)}>
                    Add new Material
                </Button>
            </div>

            <Table
                dataSource={filteredMaterials} 
                columns={columns}
                rowKey="Id"
                pagination={{ pageSize: 10 }}
                className="min-w-full shadow-lg border border-gray-300 rounded-lg text-3xl font-semibold"
                bordered
                
            />

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Blocks /> <p className="font-semibold text-xl">Add New Material</p></div>}
                open={isAddModalVisible}
                onOk={handleAddMaterial}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="MaterialName" label={<p className='font-semibold text-sm'>Material Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter material name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Material Image</p>}>
                        <Upload 
                            listType="picture-card"
                            beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button className="border-none text-gray-300" icon={<UploadIcon />}/> 
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<div className="flex justify-center items-center space-x-2"><Blocks /> <p className="font-semibold text-xl">Edit Material</p></div>}
                open={isEditModalVisible}
                onOk={handleEditMaterial}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="MaterialName" label={<p className='font-semibold text-sm'>Material Name</p>} rules={[{ required: true }]}>
                        <Input placeholder="Enter material name" />
                    </Form.Item>
                    <Form.Item name="Description" label={<p className='font-semibold text-sm'>Description</p>}>
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item name="ImageSource" label={<p className='font-semibold text-sm'>Material Image</p>}>
                        <Upload
                            listType="picture-card"
                            beforeUpload={(file) => { form.setFieldsValue({ ImageSource: file }); return false; }}>
                            <Button className="border-none text-gray-300" icon={<UploadIcon />}/>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default ManageMaterial;
