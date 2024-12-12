"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { Upload, Button, Input, Select, Table, Form, Tag } from 'antd';
import { toast } from 'react-toastify';
import { createProduct } from '@/services/product-service';
import type { Product, ProductVariant } from '@/types/entities/product-entity';
import { GetAllBrand } from '@/services/brand-service';
import { GetAllCategory } from '@/services/category-service';
import { GetAllDesigner } from '@/services/designer-service';
import { GetAllMaterial } from '@/services/material-service';
import { GetAllColors } from '@/services/color-service';
import { UploadIcon } from 'lucide-react';

const CreateProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariant>>({});
  const [loading, setLoading] = useState(false);

  const { data: brands } = useSWR('/brand', GetAllBrand, { fallbackData: [] });
  const { data: categories } = useSWR('/category', GetAllCategory, { fallbackData: [] });
  const { data: designers } = useSWR('/designer', GetAllDesigner, { fallbackData: [] });
  const { data: materials } = useSWR('/material', GetAllMaterial, { fallbackData: [] });
  const { data: colors } = useSWR('/color', GetAllColors, { fallbackData: [] });

  const handleAddVariant = () => {
    if (!currentVariant.colorId || !currentVariant.images?.length) {
      toast.error('Product Color and Images are required for a variant.');
      return;
    }

    const newVariant: ProductVariant = {
      colorId: currentVariant.colorId,
      length: currentVariant.length ?? 0,
      width: currentVariant.width ?? 0,
      height: currentVariant.height ?? 0,
      quantity: currentVariant.quantity ?? 0,
      price: currentVariant.price ?? 0,
      images: currentVariant.images,
    };

    setVariants([...variants, newVariant]);
    setCurrentVariant({}); // Reset current variant after adding
  };

  const handleDeleteVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      console.log('values', values);

      const product: Product = {
        ...values,
        Thumbnail: thumbnail!,
        ProductVariants: variants,
      };

      console.log('product', product);

      await createProduct(product);
      toast.success('Product created successfully!');
      form.resetFields();
      setThumbnail(null);
      setVariants([]);
    } catch (error) {
      toast.error('Failed to create product: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Color',  key: 'colorId', 
      render: (_: any, record: ProductVariant) => (
          colors?.map((color) => {
            if (color.Id === record.colorId) {
              return <Tag color={color.ColorCode}>{color.ColorName}</Tag>;
            }
          }
          )
      )
    },
    { title: 'Length', dataIndex: 'length', key: 'length' },
    { title: 'Width', dataIndex: 'width', key: 'width' },
    { title: 'Height', dataIndex: 'height', key: 'height' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, __: any, index: number) => (
        <Button danger onClick={() => handleDeleteVariant(index)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
        <h2 className="font-bold mb-4 border-b text-indigo-600 text-lg">Product information</h2>
      <Form layout="vertical" form={form} className='font-semibold'>
        <Form.Item name="ProductName" label="Product Name" rules={[{ required: true }]}>
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="Unit" label="Unit" rules={[{ required: true }]}>
          <Input placeholder="Enter unit" />
        </Form.Item>

        <Form.Item name="Description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item name="Discount" label="Discount (%)" rules={[{ required: true }]} getValueFromEvent={(e) => parseFloat(e.target.value)}>
          <Input type="number" placeholder="Enter discount percentage" />
        </Form.Item>

        <Form.Item name="BrandId" label="Brand" rules={[{ required: true }]}>
          <Select placeholder="Select a brand" options={brands?.map((brand) => ({ label: brand.BrandName, value: brand.Id }))} />
        </Form.Item>

        <Form.Item name="CategoryId" label="Category" rules={[{ required: true }]}>
          <Select placeholder="Select a category" options={categories?.map((category) => ({ label: category.CategoryName, value: category.Id }))} />
        </Form.Item>

        <Form.Item name="DesignersId" label="Designers" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Select designers"
            options={designers?.map((designer) => ({ label: designer.DesignerName, value: designer.Id }))}
          />
        </Form.Item>

        <Form.Item name="MaterialsId" label="Materials" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Select materials"
            options={materials?.map((material) => ({ label: material.MaterialName, value: material.Id }))}
          />
        </Form.Item>

        <Form.Item label="Thumbnail">
          <Upload
            beforeUpload={(file) => {
              setThumbnail(file);
              return false;
            }}
            listType='picture-card'
            maxCount={1}
          >
            <Button icon={<UploadIcon />}></Button>
          </Upload>
        </Form.Item>

        <div className="border-t mt-4 pt-4">
          <h2 className="font-bold mb-4 border-b text-indigo-600 text-lg">Product Variants</h2>

          <div className="grid grid-cols-2 gap-4">
            <Select
              placeholder="Select Color"
              options={colors?.map((color) => ({ label: color.ColorName, value: color.Id })) || []}
              onChange={(value) => setCurrentVariant({ ...currentVariant, colorId: value })}
            />
            <Input
              placeholder="Furniture Length"
              type="number"
              onChange={(e) => setCurrentVariant({ ...currentVariant, length: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Furniture Width"
              type="number"
              onChange={(e) => setCurrentVariant({ ...currentVariant, width: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Furniture Height"
              type="number"
              onChange={(e) => setCurrentVariant({ ...currentVariant, height: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Quantity"
              type="number"
              onChange={(e) => setCurrentVariant({ ...currentVariant, quantity: parseInt(e.target.value, 10) })}
            />
            <Input
              placeholder="Furniture Price"
              type="number"
              onChange={(e) => setCurrentVariant({ ...currentVariant, price: parseFloat(e.target.value) })}
            />
            <Upload
              multiple
              beforeUpload={(file) => {
                const images = currentVariant.images || [];
                setCurrentVariant({ ...currentVariant, images: [...images, file] });
                return false;
              }}
                listType='picture-card'
            >
              <Button icon={<UploadIcon />}></Button>
            </Upload>
          </div>

          <Button onClick={handleAddVariant} className="mt-4">Add Variant</Button>
        </div>

        <Table title={() => 'Product Variants'} dataSource={variants} columns={columns} rowKey="colorId" className="mt-4 border border-gray-300 rounded-sm"/>

        <Button
          type="primary"
          loading={loading}
          className="mt-4 font-semibold"
          onClick={handleCreateProduct}
        >
          Create Product
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
