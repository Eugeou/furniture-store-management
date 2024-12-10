"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Table, Button, Modal, Form, Input } from 'antd';
import { BookmarkPlus, Trash, SearchIcon, Pen, PaintBucket } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { Colors } from '@/types/entities/color-entity';
import { toast } from 'react-toastify';
import { GetAllColors, AddColors, EditColor, DeleteColor } from '@/services/color-service';
import envConfig from '@/configs/config';
import useDebounce from '@/hooks/useDebounce';

const ManageColor: React.FC = () => {
  const { data: colors, mutate } = useSWR<Colors[]>(envConfig.NEXT_PUBLIC_API_ENDPOINT + '/color', GetAllColors, { fallbackData: [] });
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#ffffff');
  const [editingColor, setEditingColor] = useState<Colors | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredColors = (colors ?? [])?.filter((color: { ColorName: string; }) =>
    color.ColorName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleAddColor = async () => {
    try {
      const values = await form.validateFields();
      const newColor = { ColorName: values.ColorName, ColorCode: currentColor };
      await AddColors(newColor);
      toast.success('Color added successfully');
      mutate();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error('Error adding color');
    }
  };

  const handleEditColor = async () => {
    if (!editingColor) return;
    try {
      const values = await form.validateFields();
      const updatedColor = { ...editingColor, ColorName: values.ColorName, ColorCode: currentColor };
      await EditColor(updatedColor);
      toast.success('Color updated successfully');
      mutate();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error('Error updating color');
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    try {
      await DeleteColor(colorId);
      toast.success('Color deleted successfully');
      mutate();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting color');
    }
  };

  const handleCloseModal = () => {
    setVisible(false);
    setEditMode(false);
    setCurrentColor('#ffffff');
    setEditingColor(null);
    form.resetFields();
  };

  const handleOpenAddModal = () => {
    setVisible(true);
    setEditMode(false);
  };

  const handleOpenEditModal = (color: Colors) => {
    setVisible(true);
    setEditMode(true);
    setEditingColor(color);
    setCurrentColor(color.ColorCode);
    form.setFieldsValue({ ColorName: color.ColorName });
  };

  const columns = [
    {
      title: 'Color Code',
      dataIndex: 'ColorCode',
      key: 'ColorCode',
      render: (colorCode: string) => (
        <div
          style={{
            backgroundColor: colorCode,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      title: 'Color Name',
      dataIndex: 'ColorName',
      key: 'ColorName',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: unknown, record: Colors) => (
        <div className="flex flex-row space-x-3">
          <Button icon={<Pen />} onClick={() => handleOpenEditModal(record)}>
            Edit
          </Button>
          <Button icon={<Trash />} danger onClick={() => handleDeleteColor(record.Id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center w-full mb-8">
        <Input
          placeholder="Search by color name"
          prefix={<SearchIcon />}
          className="w-2/3 h-10 rounded-lg border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="primary"
          className="font-semibold shadow-lg h-10"
          icon={<BookmarkPlus />}
          onClick={handleOpenAddModal}
        >
          Add New Color
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredColors}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
        className="shadow-lg border border-gray-300 rounded-lg"
        bordered
      />

      <Modal
        title={
          editMode ? (
            <div className="flex justify-center items-center space-x-2">
              <PaintBucket /> <p className='font-semibold text-xl'>Edit Color</p>
            </div>
          ) : (
            <div className="flex justify-center items-center space-x-2">
              <PaintBucket /> <p className='font-semibold text-xl'>Add New Color</p>
            </div>
          )
        }
        open={visible}
        onCancel={handleCloseModal}
        onOk={editMode ? handleEditColor : handleAddColor}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ColorName"
            label={<p className='font-semibold text-lg'>Color Name</p>}
            rules={[{ required: true, message: 'Please enter color name' }]}
          >
            <Input placeholder="Enter color name" />
          </Form.Item>
          <Form.Item  
            label={<p className='font-semibold text-lg'>Color Code</p>}
            rules={[{ required: true, message: 'Please choose color code' }]}
            required
            >
            <div className='flex justify-center items-center'>
            <SketchPicker
              color={currentColor}
              onChangeComplete={(color) => setCurrentColor(color.hex)}
            />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageColor;
