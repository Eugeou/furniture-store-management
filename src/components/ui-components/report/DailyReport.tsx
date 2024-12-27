"use client";

import React, { useState } from 'react';
import { Form, Button, DatePicker, Tabs, Card, Row, Col, message } from 'antd';
import moment from 'moment';
import { GetDailyRevenue, GetDailyExpense } from '@/services/report-service';
import { ReportRevenue } from '@/types/entities/report-entity';
import { Line } from '@ant-design/charts';
import { BaggageClaim, Coins, LineChart, ListChecks, ListOrdered, Package, PackageCheck } from 'lucide-react';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const DailyReport: React.FC = () => {
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [revenueData, setRevenueData] = useState<ReportRevenue[]>([]);
    const [expenseData, setExpenseData] = useState<ReportRevenue[]>([]);
    const [activeTab, setActiveTab] = useState<string>('1');

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            message.error('Please select a valid date range');
            return;
        }
        try {
            if (activeTab === '1') {
                const data = await GetDailyRevenue(startDate, endDate);
                setRevenueData(data); // set data directly
            } else if (activeTab === '2') {
                const data = await GetDailyExpense(startDate, endDate);
                setExpenseData(data); // set data directly
            }
        } catch (error: any) {
            message.error(`Failed to fetch report data: ${error.response?.data || error.message}`);
        }
    };

    const calculateSummary = (data: any[], key: string) => {
        if (!Array.isArray(data)) {
            return 0;
        }
        return data.reduce((acc, item) => acc + item[key], 0);
    };

    const lineConfig = (data: any[], yKey: string, yLabel: string) => ({
        data,
        height: 400,
        xField: 'date',
        yField: yKey,
        xAxis: { 
            title: { text: 'Date' }, 
            type: 'timeCat', 
            tickCount: 10,
            label: {
                rotate: -45,
                offset: 15,
                style: {
                    fill: '#000',
                    fontSize: 12,
                },
                formatter: (val: string) => moment(val).format('DD/MM/YY'),
            },
        },
        yAxis: { title: { text: yLabel } },
        lineStyle: {
            stroke: '#FFA500',
            lineWidth: 4,
        },
        smooth: true,
        meta: {
            date: { alias: 'Date' },
            [yKey]: { alias: yLabel },
        },
    });

    return (
        <Form form={form} layout="vertical">
            <Tabs className='font-semibold' activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
                <TabPane tab="Daily Revenue" key="1">
                    <Form.Item className='mt-3 mb-4' label="Select Date Range">
                        <div className="flex flex-row justify-start items-center space-x-6 w-full">
                            <RangePicker className='border border-gray-500 rounded-lg hover:border-blue-500 h-10'
                                
                                onChange={(dates) => {
                                    if (dates) {
                                        setStartDate(dates[0]?.format('YYYY-MM-DD') || null);
                                        setEndDate(dates[1]?.format('YYYY-MM-DD') || null);
                                    }
                                }}
                            />

                            <Button className='flex justify-center items-center space-x-1 h-10 font-semibold' type="primary" onClick={handleGenerateReport} icon={<LineChart/>}>Generate Report</Button>
                        </div>
                    </Form.Item>
                    
                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <ListOrdered color='blue' /> 
                                        <span>Total Orders</span>
                                    </div>
                                }

                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(revenueData, 'totalOrders').toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <PackageCheck color='green' /> 
                                        <span>Total Products sold</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(revenueData, 'totalProductsSold').toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Coins color='#FFA500' /> 
                                        <span>Total Revenue</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(revenueData, 'totalRevenue').toString()}</h1>
                            </Card>
                        </Col>
                    </Row>
                    <Line {...lineConfig(revenueData, 'totalRevenue', 'Total Revenue')} />
                </TabPane>
                <TabPane tab="Daily Expense" key="2">
                    <Form.Item className='mt-3 mb-4' label="Select Date Range">
                        <div className="flex flex-row justify-start items-center space-x-6 w-full">
                            <RangePicker className='border border-gray-500 rounded-lg hover:border-blue-500 h-10'
                                onChange={(dates) => {
                                    if (dates) {
                                        setStartDate(dates[0]?.format('YYYY-MM-DD') || null);
                                        setEndDate(dates[1]?.format('YYYY-MM-DD') || null);
                                    }
                                }}
                            />

                            <Button className='flex justify-center items-center space-x-1 h-10 font-semibold' type="primary" icon={<LineChart/>} onClick={handleGenerateReport}>Generate Report</Button>
                        </div>
                    </Form.Item>
                    
                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <ListChecks color='blue' /> 
                                        <span>Total Invoices</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(expenseData, 'totalInvoices').toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Package color='green' /> 
                                        <span>Total Products</span>
                                    </div>
                                }
                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(expenseData, 'totalProducts').toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <BaggageClaim color='#FFA500' /> 
                                        <span>Total Expense</span>
                                    </div>
                                }
                                bordered={false}>
                                <h1 className=' text-3xl'>{calculateSummary(expenseData, 'totalExpense').toString()}</h1>
                            </Card>
                        </Col>
                    </Row>
                    <Line {...lineConfig(expenseData, 'totalExpense', 'Total Expense')} />
                </TabPane>
            </Tabs>
        </Form>
    );
};

export default DailyReport;
