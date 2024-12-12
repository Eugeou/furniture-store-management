"use client";

import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Drawer, Form, Input, DatePicker, notification, Skeleton, Image } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { CreateCoupon, GetAllCoupons, GetDetailCoupon, UpdateCoupon, DeleteCoupon } from '@/services/coupon-service';

import { ExistedCoupon, Coupon } from '@/types/entities/coupon-entity';
import { Search, Ticket, TicketPlus } from 'lucide-react';
import useSWR from 'swr';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const ManageCoupon: React.FC = () => {

    const { data: coupons, isLoading, mutate } = useSWR<ExistedCoupon[]>('/coupon', GetAllCoupons, { fallbackData: [] });
    const [selectedCoupon, setSelectedCoupon] = useState<ExistedCoupon | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filteredCoupons = (coupons ?? []).filter((coupon: ExistedCoupon) =>
        coupon.Description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    

    const handleCardClick = async (couponId: string) => {
        try {
        const data = await GetDetailCoupon(couponId);
        setSelectedCoupon(data);
        setIsModalVisible(true);
        } catch (error) {
        console.error(error);
        }
    };

    const handleDeleteCoupon = async (couponId: string) => {
        try {
            await DeleteCoupon(couponId);
            mutate();
        notification.success({ message: 'Coupon deleted successfully' });
        } catch (error) {
        console.error(error);
        notification.error({ message: 'Failed to delete coupon' + error });
        }
    };

    const handleEditCoupon = async (values: any) => {
        if (selectedCoupon) {
        const updatedCoupon: ExistedCoupon = {
            ...selectedCoupon,
            ...values,
            StartDate: values.dateRange[0].format('YYYY-MM-DD'),
            EndDate: values.dateRange[1].format('YYYY-MM-DD')
        };
        try {
            await UpdateCoupon(selectedCoupon.Id, updatedCoupon);
            mutate();
            setIsDrawerVisible(false);
            setIsModalVisible(false);
            toast.success('Coupon updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update coupon');
        }
        }
    };

    const handleAddCoupon = async (values: any) => {
        const newCoupon: Coupon = {
        ...values,
        StartDate: values.dateRange[0].format('YYYY-MM-DD'),
        EndDate: values.dateRange[1].format('YYYY-MM-DD')
        };

        console.log('newCoupon', newCoupon);
        try {
        await CreateCoupon(newCoupon);
        setIsAddDrawerVisible(false);
        notification.success({ message: 'Coupon added successfully' });
        } catch (error) {
        console.error(error);
        notification.error({ message: 'Failed to add coupon' });
        }
    };

    const validateDates = (rule: any, value: any, callback: any) => {
        if (value && (value[0].isBefore(dayjs(), 'day') || value[1].isSameOrBefore(value[0], 'day'))) {
        callback('Start date must be today or in the future, and end date must be after the start date.');
        } else {
        callback();
        }
    };

    const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const columns = [
        {
        title: 'Image',
        dataIndex: 'ImageSource',
        key: 'ImageSource',
            render: (image: string) => <Image src={image} alt="coupon" width={40}/>,
        },
        {
        title: 'Description',
        dataIndex: 'Description',
        key: 'Description',
        },
        {
        title: 'Start Date',
        dataIndex: 'StartDate',
        key: 'StartDate',
        render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
        title: 'End Date',
        dataIndex: 'EndDate',
        key: 'EndDate',
        render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
        title: 'Discount Value',
        dataIndex: 'DiscountValue',
        key: 'DiscountValue',
        },
        {
        title: 'Minimum Bill',
        dataIndex: 'MinOrderValue',
        key: 'MinOrderValue',
        },
        {
        title: 'Quantity',
        dataIndex: 'Quantity',
        key: 'Quantity',
        },
        
        {
        title: 'Action',
        key: 'action',
        render: (_: any, record: ExistedCoupon) => (
            <div>
            <Button className='mr-1' icon={<EyeOutlined />} onClick={() => handleCardClick(record.Id)} />
            <Button className='mr-1' icon={<EditOutlined />} onClick={() => {
                setSelectedCoupon(record);
                setIsDrawerVisible(true);
            }} />
            <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCoupon(record.Id)} />
            </div>
        )
        }
    ];

    return (
        <div> 
        <div className="flex justify-between items-center w-full space-x-0">
            <Input 
            className="focus:placeholder-transparent focus:border-blue-500 mb-6 w-2/3 h-10 border border-gray-400 rounded-lg shadow-lg" 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search by coupon name"
            size="middle"
            prefix={<Search />}
            />
            <Button className="flex flex-row text-center items-center space-x-1 h-10 rounded-lg mb-6 shadow-xl"
            type="primary" icon={<TicketPlus />} onClick={() => setIsAddDrawerVisible(true)}>Add New Coupon</Button>
        </div> 
        
        {isLoading ? (
            <Skeleton active />
        ) : (
            <Table columns={columns} dataSource={filteredCoupons} rowKey="id" pagination={{ pageSize: 6 }} className="min-w-full rounded-lg shadow-xl border border-gray-400"
            bordered />
        )}
        <Modal
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
            ]}
        >
            {selectedCoupon && (
            <div className='flex flex-col space-y-4'>
                <div className='flex space-x-2 justify-center  mr-2 font-bold text-lg rounded-lg h-10 items-center'>
                    <Ticket/>
                    <p>Coupon Detail</p>
                </div>

                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Description: {selectedCoupon.Description}</p>
                </div>
                
                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Start Date: {dayjs(selectedCoupon.StartDate).format('DD-MM-YYYY')}</p>
                </div>
                
                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>End Date: {dayjs(selectedCoupon.EndDate).format('DD-MM-YYYY')}</p>
                </div>

                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Discount Type: {selectedCoupon.DiscountValue}</p>
                </div>
                
                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Minimum Bill: {selectedCoupon.MinOrderValue}</p>
                </div>

                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Quantity: {selectedCoupon.Quantity}</p>
                </div>
                
                <div className='flex p-2 font-semibold border border-gray-600 rounded-lg h-10 items-center'>
                    <p>Coupon type: {selectedCoupon.ECouponType}</p>
                </div>
            </div>
            )}
        </Modal>
        <Drawer
            title="Edit Coupon"
            open={isDrawerVisible}
            onClose={() => setIsDrawerVisible(false)}
            width={400}
        >
            {selectedCoupon && (
            <Form
                layout="vertical"
                initialValues={{
                ...selectedCoupon,
                dateRange: [dayjs(selectedCoupon.StartDate), dayjs(selectedCoupon.EndDate)]
                }}
                onFinish={handleEditCoupon}
            >
                <Form.Item name="Description" label="Description" rules={[{ required: true, message: 'Please input the coupon name!' }]}>
                    <Input className='border border-gray-500 rounded-lg hover:border-blue-500' />
                </Form.Item>
                <Form.Item name="dateRange" label="Date Range" rules={[{ required: true, validator: validateDates }]}>
                    <RangePicker className='border border-gray-500 rounded-lg hover:border-blue-500' />
                </Form.Item>
                <Form.Item name="DiscountValue" label="Discount Value" rules={[{ required: true, message: 'Please input the discount value!' }]}>
                    <Input className='border border-gray-500 rounded-lg hover:border-blue-500' placeholder='%' type="number" min={1} max={100} />
                </Form.Item>
                <Form.Item name="MinOrderValue" label="Minimum Bill" rules={[{ required: true, message: 'Please input the minimum bill!' }]}>
                    <Input className='border border-gray-500 rounded-lg hover:border-blue-500' type="number" min={1}/>
                </Form.Item>
                <Form.Item name="Quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                    <Input className='border border-gray-500 rounded-lg hover:border-blue-500' type="number" min={1} />
                </Form.Item>
                <Form.Item name="ECouponType" label="Coupon type" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                    <Input className='border border-gray-500 rounded-lg hover:border-blue-500' type="number" min={1} />
                </Form.Item>
                <Button type="primary" htmlType="submit">Update Coupon</Button>
            </Form>
            )}
        </Drawer>
        <Drawer
            title="Add new Coupon"
            open={isAddDrawerVisible}
            onClose={() => setIsAddDrawerVisible(false)}
            width={400}
        >
            <Form layout="vertical" onFinish={handleAddCoupon}>
            <Form.Item name="Description" label="Description" rules={[{ required: true, message: 'Please input the coupon name!' }]}>
                <Input className='border border-gray-500 rounded-lg hover:border-blue-500' />
            </Form.Item>
            <Form.Item name="dateRange" label="Date Range" rules={[{ required: true, validator: validateDates }]}>
                <RangePicker className='border border-gray-500 rounded-lg hover:border-blue-500 h-full' />
            </Form.Item>
            <Form.Item name="DiscountValue" label="Discount Value" rules={[{ required: true, message: 'Please input the discount value!' }]}>
                <Input className='border border-gray-500 rounded-lg hover:border-blue-500' placeholder='%' type="number" min={1} max={100} />
            </Form.Item>
            <Form.Item name="MinOrderValue" label="Minimum Bill" rules={[{ required: true, message: 'Please input the minimum bill!' }]}>
                <Input className='border border-gray-500 rounded-lg hover:border-blue-500' type="number" min={1} />
            </Form.Item>
            <Form.Item name="Quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                <Input className='border border-gray-500 rounded-lg hover:border-blue-500' type="number" min={1} />
            </Form.Item>
            <Form.Item name="ECouponType" label="Coupon Type" rules={[{ required: true, message: 'Please input the coupon type!' }]}>
                <Input className='border border-gray-500 rounded-lg hover:border-blue-500' />
            </Form.Item>
            <Button type="primary" htmlType="submit">Add Coupon</Button>
            </Form>
        </Drawer>
        </div>
    );
    };

    export default ManageCoupon;
