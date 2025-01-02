"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Select,
  InputNumber,
  Button,
  Table,
  Form,
  message,
  Spin,
  Image,
  Popconfirm,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetAllProducts } from '@/services/product-service'; 
import { ImportProduct } from '@/services/import-service'; 
import { ProductGet, ProductVariantGet } from '@/types/entities/product-entity'; 
import { AddImportItem } from '@/types/entities/import-entity';

const { Option } = Select;


const ImportProducts: React.FC = () => {
  // Fetch all products using useSWR
  const { data: products, error, isLoading } = useSWR<ProductGet[]>('/product', GetAllProducts, {
    fallbackData: [],
  });

  // State to hold selected product variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantGet | null>(null);

  // State to hold import items
  const [importItems, setImportItems] = useState<AddImportItem[]>([]);

  // Form instance for handling inputs
  const [form] = Form.useForm();

  /**
   * Handle product selection
   * @param productId - ID of the selected product
   */
  const handleProductChange = (productId: string) => {
    // Find the selected product
    const product = products?.find((p) => p.Id === productId);
    if (product && product.ProductVariants.length > 0) {
      // Set the first variant as default selected
      setSelectedVariant(product.ProductVariants[0]);
      // Reset form fields
      form.resetFields(['price', 'quantity']);
    } else {
      setSelectedVariant(null);
    }
  };

  /**
   * Handle variant selection
   * @param variantId - ID of the selected variant
   */
  const handleVariantChange = (variantId: string) => {
    // Find and set the selected variant
    const variant = selectedProduct?.ProductVariants.find((v) => v.Id === variantId) || null;
    setSelectedVariant(variant);
    // Reset form fields
    form.resetFields(['price', 'quantity']);
  };

  // Get the currently selected product
  const selectedProduct = products?.find((p) =>
    p.ProductVariants.some((v) => v.Id === selectedVariant?.Id)
  );

  /**
   * Handle adding an import item
   */
  const handleAddImportItem = () => {
    form
      .validateFields(['price', 'quantity'])
      .then((values) => {
        if (selectedVariant) {
          const { price, quantity } = values;
          // Ensure entered price is less than variant's original price
          if (price >= selectedVariant.Price) {
            message.error('Entered price must be lower than the variant\'s original price.');
            return;
          }

          const total = price * quantity;

          const newItem: AddImportItem = {
            productVariantId: selectedVariant.Id,
            price,
            quantity,
            total,
          };

          setImportItems([...importItems, newItem]);
          message.success('Variant added to import list.');

          // Reset form fields
          form.resetFields(['price', 'quantity']);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  /**
   * Handle removing an import item
   * @param index - Index of the item to remove
   */
  const handleRemoveImportItem = (index: number) => {
    const updatedItems = importItems.filter((_, i) => i !== index);
    setImportItems(updatedItems);
    message.success('Variant removed from import list.');
  };

  /**
   * Handle importing products
   */
  const handleImport = async () => {
    if (importItems.length === 0) {
      message.error('Please add at least one variant to import.');
      return;
    }

    console.log('Importing products:', importItems);

    try {
      await ImportProduct(importItems);
      message.success('Products imported successfully!');
      // Clear the import list
      setImportItems([]);
    } catch (error) {
      console.error(error);
      message.error('Failed to import products.');
    }
  };

  const formatPrice = (price : number) => {
    //const firstPrice = price.split(" - ")[0];
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price));
  };

  // Define columns for the import items table
  const importColumns = [
    {
      title: 'Variant ID',
      dataIndex: 'productVariantId',
      key: 'productVariantId',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatPrice(price)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${formatPrice(total)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <Popconfirm
          title="Are you sure you want to remove this variant?"
          onConfirm={() => handleRemoveImportItem(index)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  // Define columns for the products table (optional, if needed for reference)
  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
    },
    {
      title: 'Brand',
      dataIndex: 'BrandName',
      key: 'BrandName',
    },
    {
      title: 'Category',
      dataIndex: 'CategoryName',
      key: 'CategoryName',
    },
    {
      title: 'Price Range',
      dataIndex: 'DisplayPrice',
      key: 'DisplayPrice',
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading products..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-xl font-semibold text-green-900 mb-6">Product information</h3>

      {/* Product Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-700 mb-2">Select a product</h3>
        <Select
          showSearch
          placeholder="Select a product"
          optionFilterProp="children"
          onChange={handleProductChange}
          filterOption={(input, option) =>
            (option?.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          className="w-full h-10"
          
        >
          {products?.map((product) => (
            <Option key={product.Id} value={product.Id}>
                <div className="flex items-center">
                <Image
                    src={product.ImageSource}
                    alt={product.ProductName}
                    width={30}
                    height={30}
                    className="border border-gray-300 rounded-lg"
                    />
                <p className='ml-4 font-semibold'>{product.ProductName}</p>
                </div>
            </Option>
          ))}
        </Select>
      </div>

      {/* Variant Selection and Input */}
      {selectedVariant && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Select Variant</h3>
          <Select
            placeholder="Select a variant"
            onChange={handleVariantChange}
            className="w-full mb-6"
            value={selectedVariant?.Id}
          >
            {selectedProduct?.ProductVariants.map((variant) => (
              <Option key={variant.Id} value={variant.Id}>
                <strong>Color: </strong>{variant.ColorName} - <strong>Size: </strong>{variant.SizeName} - <strong>Quantity: </strong>{variant.Quantity} - <strong>Sold price: </strong>{formatPrice(variant.Price)}
              </Option>
            ))}
          </Select>

          <Form form={form} layout="inline">
            {/* Price Input */}
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: 'Please enter the price.' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Price must be a positive number.',
                },
              ]}
            >
              <InputNumber
                placeholder="Enter price (VNĐ)"
                className="w-full"
                min={0}
                max={selectedVariant.Price - 1}
                //formatter={(value) => `VNĐ ${value}`}
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            {/* Quantity Input */}
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: 'Please enter the quantity.' },
                {
                  type: 'number',
                  min: 1,
                  message: 'Quantity must be at least 1.',
                },
              ]}
            >
              <InputNumber
                placeholder="Enter quantity"
                className="w-full"
                min={1}
                //max={selectedVariant.Quantity}
              />
            </Form.Item>

            {/* Add Variant Button */}
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddImportItem}
                  disabled={
                    !form.isFieldsTouched(['price', 'quantity'], true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  Add Variant
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      )}

      {/* Import Items Table */}
      {importItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl text-green-700 font-semibold mb-2">Import List</h2>
          <Table
            dataSource={importItems}
            columns={importColumns}
            rowKey={(record) => record.productVariantId + record.price}
            pagination={false}
            className="bg-white shadow rounded-lg"
          />
        </div>
      )}

      {/* Import Button */}
      <div className="text-right">
        <Button
          type="primary"
          size="large"
          onClick={handleImport}
          disabled={importItems.length === 0}
        >
          Import
        </Button>
      </div>
    </div>
  );
};

export default ImportProducts;