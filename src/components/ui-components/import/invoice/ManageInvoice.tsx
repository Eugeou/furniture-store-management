"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import { Table, Input, Select, Spin, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { GetAllImport } from '@/services/import-service';
import { ImportDetailResponse, ImportItemResponse } from '@/types/entities/import-entity';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ManageInvoice: React.FC = () => {
  // State for filters
  const [totalFilter, setTotalFilter] = useState<number | null>(null);
  const [productNameFilter, setProductNameFilter] = useState<string | null>(null);

  // Use SWR to fetch import data
  const { data: imports, error, isLoading } = useSWR<ImportDetailResponse[]>('/import', GetAllImport, {
    fallbackData: [],
  });

  /**
   * Handle filtering based on Total
   * @param total - Total amount to filter by
   */
  const handleTotalFilter = (total: number) => {
    setTotalFilter(total);
  };

  /**
   * Handle filtering based on Product Name
   * @param productName - Product name to filter by
   */
  const handleProductNameFilter = (productName: string) => {
    setProductNameFilter(productName);
  };

  /**
   * Define columns for the Ant Design Table
   */
  const columns: ColumnsType<ImportDetailResponse> = [
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      sorter: (a, b) => a.Total - b.Total,
      render: (total: number) => `${total.toFixed(2)}đ`,
    },
    {
      title: 'Product Names',
      key: 'ProductNames',
      dataIndex: 'ImportItemResponse',
      render: (items: ImportItemResponse[]) => {
        if (items.length === 0) {
          return <span className="text-gray-500">No Data</span>;
        }
        return (
          <ul className="list-disc list-inside">
            {items.map((item, index) => (
              <li key={index}>{item.ProductName}</li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Quantity',
      key: 'Quantity',
      dataIndex: 'ImportItemResponse',
      render: (items: ImportItemResponse[]) => {
        if (items.length === 0) {
          return <span className="text-gray-500">No Data</span>;
        }
        // Sum up the quantities of all items in the import
        const totalQuantity = items.reduce((sum, item) => sum + item.Quantity, 0);
        return <span>{totalQuantity}</span>;
      },
    },
    {
      title: 'Price',
      key: 'Price',
      dataIndex: 'ImportItemResponse',
      render: (items: ImportItemResponse[]) => {
        if (items.length === 0) {
          return <span className="text-gray-500">No Data</span>;
        }
        // Sum up the prices (assuming each item has a distinct price)
        const totalPrice = items.reduce((sum, item) => sum + item.Price, 0);
        return <span>{totalPrice.toFixed(2)}đ</span>;
      },
    },
    {
      title: 'Import Total',
      key: 'ImportTotal',
      dataIndex: 'ImportItemResponse',
      render: (items: ImportItemResponse[]) => {
        if (items.length === 0) {
          return <span className="text-gray-500">No Data</span>;
        }
        // Sum up the total amounts of all items in the import
        const importTotal = items.reduce((sum, item) => sum + item.Total, 0);
        return <span>{importTotal.toFixed(2)}đ</span>;
      },
    },
  ];

  /**
   * Apply Filters to the imported data
   * - Filter by Total
   * - Filter by Product Name
   */
  const filteredImports = imports?.filter((importItem) => {
    let isTotalMatch = true;
    let isProductNameMatch = true;

    if (totalFilter !== null) {
      isTotalMatch = importItem.Total === totalFilter;
    }

    if (productNameFilter !== null) {
      isProductNameMatch = importItem.ImportItemResponse.some(
        (item) => item.ProductName.toLowerCase() === productNameFilter.toLowerCase()
      );
    }

    return isTotalMatch && isProductNameMatch;
  });

  // If there's an error fetching data
  if (error) {
    message.error('Failed to load import data.');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load import data.</p>
      </div>
    );
  }

  // If data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading import data..." size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-6">Manage Invoices</h1> */}

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        {/* Filter by Total */}
        <div className="flex items-center mb-4 md:mb-0">
          {/* <span className="mr-2 font-semibold">Filter by Total:</span> */}
          <Input
            placeholder="Enter total"
            type="number"
            min={0}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleTotalFilter(Number(value));
              } else {
                setTotalFilter(null);
              }
            }}
            className="w-full max-w-xs"
            prefix={<SearchOutlined />}
          />
        </div>

        {/* Filter by Product Name */}
        <div className="flex items-center">
          {/* <span className="mr-2 font-semibold">Filter by Product Name:</span> */}
          <Select
            showSearch
            placeholder="Select a product"
            optionFilterProp="children"
            onChange={handleProductNameFilter}
            allowClear
            className="w-full max-w-xs"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {/* Extract unique product names from the import data */}
            {imports && Array.from(
              new Set(
                imports
                  .flatMap((importItem) => importItem.ImportItemResponse)
                  .map((item) => item.ProductName)
              )
            ).map((productName) => (
              <Option key={productName} value={productName}>
                {productName}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Import Invoices Table */}
      <Table<ImportDetailResponse>
        columns={columns}
        dataSource={filteredImports}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
        className="bg-white shadow rounded-lg border border-gray-300"
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4 bg-gray-50">
              {record.ImportItemResponse.length > 0 ? (
                <Table<ImportItemResponse>
                  
                  dataSource={record.ImportItemResponse}
                  columns={[
                    {
                      title: 'ProductVariantId',
                      dataIndex: 'ProductVariantId',
                      key: 'ProductVariantId',
                      render: (text: string) => <span>{text}</span>,
                    },
                    {
                      title: 'Product Name',
                      dataIndex: 'ProductName',
                      key: 'ProductName',
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
                      render: (price: number) => `${price.toFixed(2)}đ`,
                    },
                    {
                      title: 'Total',
                      dataIndex: 'Total',
                      key: 'Total',
                      render: (total: number) => `${total.toFixed(2)}đ`,
                    },
                  ]}
                  pagination={false}
                  rowKey={(item) => item.ProductVariantId + item.Price}
                  className="bg-white shadow rounded-lg border border-gray-300"
                />
              ) : (
                <p className="text-gray-500">No Data</p>
              )}
            </div>
          ),
          rowExpandable: (record) => record.ImportItemResponse.length > 0,
        }}
      />
    </div>
  );
};

export default ManageInvoice;