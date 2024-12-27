"use client";
import React, { useState } from 'react';
import { Table, Button, Drawer, Select, message, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { GetAllOrders, ChangeOrderStatus } from '@/services/order-service'; // Adjust the import path accordingly
import { OrderEntity } from '@/types/entities/order-entity';
import useSWR from 'swr';

const { Option } = Select;

/**
 * Fetcher function for useSWR
 * @param url - API endpoint
 * @returns - Fetch response as JSON
 */

const ManageOrders: React.FC = () => {
  // State to control the visibility of the Drawer
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  
  // State to hold the selected order details
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  
  // State to handle loading state for status change
  const [statusChanging, setStatusChanging] = useState<boolean>(false);
  
  // Use SWR to fetch orders
  const { data: orders, error, mutate, isLoading } = useSWR<OrderEntity[]>('/order', GetAllOrders, { fallbackData: [] });

  /**
   * Handle opening the Drawer with selected order details
   * @param order - The order to view
   */
  const showDrawer = (order: OrderEntity) => {
    setSelectedOrder(order);
    setIsDrawerVisible(true);
  };

  /**
   * Handle closing the Drawer
   */
  const onClose = () => {
    setIsDrawerVisible(false);
    setSelectedOrder(null);
  };

  /**
   * Handle changing the order status
   * @param orderId - ID of the order
   * @param status - New status value
   */
  const handleChangeStatus = async (orderId: string, status: string) => {
    setStatusChanging(true);
    try {
      await ChangeOrderStatus(orderId, status);
      console.log('Status:', status);
      message.success('Order status updated successfully!');
      mutate(); // Refresh the orders data
    } catch (error) {
      message.error('Failed to update order status.');
    } finally {
      setStatusChanging(false);
    }
  };

  // Define the columns for the Ant Design Table
  const columns: ColumnsType<OrderEntity> = [
    {
      title: 'Order ID',
      dataIndex: 'Id',
      key: 'Id',
      //sorter: (a, b) => a.Id.localeCompare(b.Id),
      ellipsis: true,
    },
    // {
    //   title: 'Full Name',
    //   dataIndex: 'FullName',
    //   key: 'FullName',
    //   //sorter: (a, b) => a.FullName.localeCompare(b.FullName),
    //   ellipsis: true,
    // },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      ellipsis: true,
      filters: [
        { text: 'gmail.com', value: 'gmail.com' },
        { text: 'yahoo.com', value: 'yahoo.com' },
        { text: 'outlook.com', value: 'outlook.com' },
      ],
      onFilter: (value, record) => record.Email.includes(value as string),
    },
    {
      title: 'Payment Method',
      dataIndex: 'PaymentMethod',
      key: 'PaymentMethod',
      ellipsis: true,
    },
    {
      title: 'Order Status',
      dataIndex: 'OrderStatus',
      key: 'OrderStatus',
      render: (status: string) => {
        let statusText = '';
        let color = '';

        switch (status) {
          case 'Canceled':
            statusText = 'Canceled';
            color = 'text-red-500';
            break;
          case 'Refund':
            statusText = 'Refund';
            color = 'text-red-500';
            break;
          case 'ReturnGoods':
            statusText = 'Return';
            color = 'text-red-500';
            break;
          case 'Confirmed':
            statusText = 'Confirmed';
            color = 'text-green-500';
            break;
          case 'Paid':
            statusText = 'Paid';
            color = 'text-green-500';
            break;
          case 'Completed':
            statusText = 'Completed';
            color = 'text-blue-500';
            break;
          default:
            statusText = 'Pending';
            color = 'text-yellow-500';
        }

        return <span className={`font-semibold ${color}`}>{statusText}</span>;
      },
      filters: [
        { text: 'Cancel', value: '0' },
        { text: 'Paid', value: '1' },
        { text: 'Pending', value: '2' },
      ],
      onFilter: (value, record) => record.OrderStatus === value,
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      sorter: (a, b) => a.Total - b.Total,
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex space-x-2">
          {/* View Button */}
          <Button type="primary" onClick={() => showDrawer(record)}>
            View
          </Button>
          {/* Change Status Button with Select Dropdown */}
          <Select
            style={{ width: 120 }}
            placeholder="Change Status"
            onChange={(value: string) => handleChangeStatus(record.Id, value)}
            loading={statusChanging}
          >
            <Option value={"Pending"}>Pending</Option>
            <Option value={"Paid"}>Paid</Option>
            <Option value={"Confirmed"}>Confirmed</Option>
            <Option value={"Canceled"}>Canceled</Option>
            <Option value={"Completed"}>Completed</Option>
          </Select>
        </div>
      ),
    },
  ];

  // Handle loading and error states
  if (error) return <div className="p-4 text-red-500">Failed to load orders.</div>;
  if (!orders) return <div className="p-4"><Spin tip="Loading orders..." /></div>;

  return (
    <div className="p-4">
      
      {/* Orders Table */}
      <Table<OrderEntity>
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
        className="bg-white shadow rounded-lg"
      />

      {/* Order Details Drawer */}
      <Drawer
        title={`Order Details - ${selectedOrder?.Id}`}
        placement="right"
        onClose={onClose}
        visible={isDrawerVisible}
        width={500}
        className="bg-gray-50"
      >
        {selectedOrder ? (
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold">Basic Information</h3>
              <p><strong>Full Name:</strong> {selectedOrder.FullName}</p>
              <p><strong>Email:</strong> {selectedOrder.Email}</p>
              <p><strong>Phone Number:</strong> {selectedOrder.PhoneNumber}</p>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="font-semibold">Address</h3>
              <p><strong>Specific Address:</strong> {selectedOrder.Address.SpecificAddress}</p>
              <p><strong>Ward:</strong> {selectedOrder.Address.Ward}</p>
              <p><strong>District:</strong> {selectedOrder.Address.District}</p>
              <p><strong>Province:</strong> {selectedOrder.Address.Province}</p>
              <p><strong>Postal Code:</strong> {selectedOrder.Address.PostalCode}</p>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="font-semibold">Order Details</h3>
              <p><strong>Payment Method:</strong> {selectedOrder.PaymentMethod}</p>
              <p><strong>Note:</strong> {selectedOrder.Note || 'N/A'}</p>
              <p><strong>Shipping Fee:</strong> {selectedOrder.ShippingFee.toFixed(2)}đ</p>
              <p><strong>Tax Fee:</strong> {selectedOrder.TaxFee.toFixed(2)}đ</p>
              <p><strong>Sub Total:</strong> {selectedOrder.SubTotal.toFixed(2)}đ</p>
              <p><strong>Total:</strong> {selectedOrder.Total.toFixed(2)}đ</p>
              <p><strong>Accounts Receivable:</strong> {selectedOrder.AccountsReceivable.toFixed(2)}đ</p>
            </div>

            {/* Order Timestamps */}
            <div>
              <h3 className="font-semibold">Order Status Timestamps</h3>
              <p><strong>Canceled At:</strong> {selectedOrder.CanceledAt || 'N/A'}</p>
              <p><strong>Completed At:</strong> {selectedOrder.CompletedAt || 'N/A'}</p>
              <p><strong>Delivered At:</strong> {selectedOrder.DeliveredAt || 'N/A'}</p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold">Order Items</h3>
              <ul className="list-disc list-inside">
                {selectedOrder.OrderItemResponses.length > 0 ? (
                  selectedOrder.OrderItemResponses.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No items in this order.</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <Spin tip="Loading order details..." />
        )}
      </Drawer>
    </div>
  );
};

export default ManageOrders;