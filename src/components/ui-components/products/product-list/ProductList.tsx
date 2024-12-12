"use client";

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import useDebounce from '@/hooks/useDebounce';
import { Table, Button, Drawer, Image, Space, Skeleton, Avatar, Tag, Input, Grid } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { GetAllProducts, DeleteProduct, GetDetailProduct } from '@/services/product-service';

import { ProductGet, ProductVariantGet } from '@/types/entities/product-entity';
import { BookmarkPlus, Search } from 'lucide-react';


const ProductList: React.FC = () => {
    
    const { data: products, isLoading, mutate } = useSWR<ProductGet[]>('/product', GetAllProducts, { fallbackData: [] });
    const [productItems, setProductItems] = useState<ProductVariantGet[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductGet | null>(null);
    //const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const screens = Grid.useBreakpoint(); 

    const filteredProducts = (products ?? []).filter((product: { ProductName: string; }) =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showDrawer = async (product: ProductGet) => {
        setVisible(true);
        setSelectedProduct(product);
        try {
            const productDetail = await GetDetailProduct(product.Id);
            setProductItems(productDetail.ProductVariants);
        } catch (error) {
            toast.error('Failed to get product detail: ' + error);
        }
        
    };

    const deleteProduct = async (id: string) => {
        try {
            await DeleteProduct(id);
            mutate();
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product: ' + error);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/edit-product/${id}`);
    };

    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'ImageSource',
            key: 'ImageSource',
            render: (image: string) => <Image src={image ? image : "/faq.png"} alt="product image" width={40} />,
        },
        {
            title: 'Product name',
            dataIndex: 'ProductName',
            key: 'ProductName',
        },
        {
            title: 'Unit',
            dataIndex: 'Unit',
            key: 'Unit',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Display price',
            dataIndex: 'DisplayPrice',
            key: 'DisplayPrice',
        },
        {
            title: 'Category',
            dataIndex: 'CategoryName',
            key: 'CategoryName',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Brand',
            dataIndex: 'BrandName',
            key: 'BrandName',
            render: (text: string) => <Tag color="orange">{text}</Tag>,
        },
        {
            title: 'Materials',
            dataIndex: 'Materials',
            key: 'Materials',
            render: (text: string[]) => (
                <Space size="middle">
                    {text.map((material) => (
                        <Tag color="green" key={material}>
                            {material}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {   
            title: 'Designers',
            dataIndex: 'Designers',
            key: 'Designers',
            render: (text: string[]) => (
                <Space size="middle">
                    {text.map((designer) => (
                        <Tag color="yellow" key={designer}>
                            {designer}
                        </Tag>
                    ))}
                </Space>
            ),

        },
        
        {
            title: 'Actions',
            key: 'action',
            render: (text: any, record: ProductGet) => (
                <Space size="small">
                    <Button className='flex justify-between items-center' onClick={() => showDrawer(record)}>
                        <EyeOutlined /> <p>View detail</p>
                    </Button>
                    <Button type="primary"  className='flex justify-between items-center' onClick={() => handleEdit(record.Id)}>
                        <EditOutlined /> <p>Edit product</p>
                    </Button>
                    <Button danger className='flex justify-between items-center' onClick={() => deleteProduct(record.Id)}>
                        <DeleteOutlined /> <p>Delete product</p>
                    </Button>
                </Space>
            ),
        },
    ];

    const productItemColumns = [
        { 
            title: 'Thumbnail',
            dataIndex: 'ImageSource',
            key: 'ImageSource',
            render: (image: string) => <Image src={image ? image : "/favicon.png"} alt="product image" width={40} />,
        },
        {
            title: 'Color',
            dataIndex: 'ColorName',
            key: 'ColorName',
            render: (text: string) => <Tag color={text}>{text}</Tag>,
        },
        {
            title: 'Display dimension',
            dataIndex: 'DisplayDimension',
            key: 'DisplayDimension',
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
        },
        {
            title: 'Price',
            dataIndex: 'Price',
            key: 'Price',
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-row space-x-4 justify-end mb-6">
                <div className="flex w-full justify-start h-10 border border-gray-500 rounded-lg p-2 focus:outline-none hover:border-blue-500 focus:border-transparent shadow-lg">
                    <Search className='text-gray-500 mr-3' />
                    <Input
                        className='w-full border-none focus:outline-none'
                        placeholder={"Search by product name"}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    className="flex flex-row text-center items-center space-x-1 text-sm h-10 rounded-lg mb-4 shadow-xl"
                    type="primary"
                    onClick={() => router.push('/product/add-product')}
                    icon={<BookmarkPlus width={18} height={18} />}
                >
                    Add New Product
                </Button>
                <Button
                    className="flex flex-row text-center items-center space-x-1 text-sm h-10 rounded-lg mb-4 shadow-xl"
                    type="primary"
                    onClick={() => router.push('/pages/manage-products/products/add-existed-product')}
                    icon={<BookmarkPlus width={18} height={18} />}
                >
                    Add Existed Product
                </Button>
            </div>

            {isLoading ? (
                <Skeleton active />
            ) : (
                <Table
                    className='border border-gray-500 rounded-lg shadow-xl'
                    dataSource={filteredProducts}
                    rowKey="Id"
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: screens.md ? undefined : 'auto' }}
                />
            )}

            <Drawer
                title={selectedProduct?.ProductName}
                placement="right"
                onClose={() => setVisible(false)}
                open={visible}
                width={800}
            >
                {selectedProduct && (
                    <>
                        <div className="flex justify-center items-center w-full"><Image src={selectedProduct.ImageSource ? selectedProduct.ImageSource : '/favicon.png'} width={150} /></div>

                        <h2 className="font-semibold text-lg mt-4 border-b text-indigo-600">Product Information</h2>
                        
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Product Name</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.ProductName}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Description</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.Description}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Display Price</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.DisplayPrice}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Category</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.CategoryName}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Brand</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.BrandName}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Discount</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <p className="text-sm">{selectedProduct.Discount}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Materials</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <Tag color='geekblue' className="text-sm">{selectedProduct.Materials.join(' - ')}</Tag>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2">Designers</label>
                            <div className="p-2 border border-gray-700 rounded-lg">
                                <Tag color='geekblue' className="text-sm">{selectedProduct.Designers.join(' - ')}</Tag>
                            </div>
                        </div>
                        

                        <h2 className="font-semibold text-lg mt-8 border-b text-indigo-600">Product Variants</h2>

                        <Table
                            className="mt-4 border border-gray-400 rounded-md shadow-xl"
                            columns={productItemColumns}
                            dataSource={productItems}
                            pagination={false}
                            bordered
                            scroll={{ x:'auto' }}
                        />
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default ProductList;
