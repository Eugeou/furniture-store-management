"use client";

import React from 'react';
import { Form, Card, Row, Col } from 'antd';
import moment from 'moment';
import { GetTotalRevenueReport } from '@/services/report-service';

//import { Line } from '@ant-design/charts';
import { ArrowRight, BarChart, Coins, ListOrdered,  PackageCheck, PieChart, Slack, Ticket, UserPen, Users, UsersIcon } from 'lucide-react';
import useSWR from 'swr';
import { GetAllDesigner } from '@/services/designer-service';
import { GetAllStaffs } from '@/services/staff-service';
import { GetAllCoupons } from '@/services/coupon-service';
import { GetAllBrand } from '@/services/brand-service';
import Link from 'next/link';


// const { RangePicker } = DatePicker;
// const { TabPane } = Tabs;

const DashBoard: React.FC = () => {
    //const [form] = Form.useForm();
    //const [startDate, setStartDate] = useState<string | null>(null);
    //const [endDate, setEndDate] = useState<string | null>(null);
    // const [revenueData, setRevenueData] = useState<ReportRevenue[]>([]);
    // const [expenseData, setExpenseData] = useState<ReportRevenue[]>([]);
    // const [activeTab, setActiveTab] = useState<string>('1');
    const { data: revenueData } = useSWR('/analysis/summary', GetTotalRevenueReport);
    const { data: designerData } = useSWR('/designer', GetAllDesigner, { fallbackData: [] });
    const { data: staffData } = useSWR('/staff', GetAllStaffs, { fallbackData: [] });
    const { data: couponData } = useSWR('/coupon', GetAllCoupons, { fallbackData: [] });
    const { data: brandData } = useSWR('/brand', GetAllBrand, { fallbackData: [] });


    console.log(revenueData);

    

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
        <Form layout="vertical"> 
            <h3 className="text-lg flex items-center font-semibold mb-4"><PieChart className='mr-2 text-gray-700'/>Orders and revenue overview</h3>      
            <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <ListOrdered color='blue' /> 
                                        <span>Total Orders</span>
                                    </div>
                                }

                                bordered={false}>
                                <h1 className=' text-3xl'>{revenueData?.TotalOrders.toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <PackageCheck color='green' /> 
                                        <span>Total Products</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{revenueData?.TotalProducts.toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Users color='#FFA500' /> 
                                        <span>Total Customers</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{revenueData?.TotalCustomers.toString()}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Coins color='#FFA500' /> 
                                        <span>Total Revenue</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{revenueData?.TotalRevenue.toString()}</h1>
                            </Card>
                        </Col>
            </Row>

            <h3 className="text-lg flex items-center font-semibold mb-2 mt-6"><BarChart className='mr-2 text-gray-700'/>Staffs and other overview</h3>

            <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <UsersIcon color='blue' /> 
                                        <span>Total Staffs</span>
                                    </div>
                                }

                                bordered={false}>
                                <h1 className=' text-3xl'>{staffData?.length}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <UserPen color='green' /> 
                                        <span>Total Designers</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{designerData?.length}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Ticket color='#FFA500' /> 
                                        <span>Total Coupons</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{couponData?.length}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className='border border-gray-500 rounded-lg shadow-2xl mb-4' 
                                title={
                                    <div className="flex justify-start items-center text-xl font-semibold mb-4 space-x-2">
                                        <Slack color='#FFA500' /> 
                                        <span>Total Brands</span>
                                    </div>
                                } 
                                bordered={false}>
                                <h1 className=' text-3xl'>{brandData?.length}</h1>
                            </Card>
                        </Col>
            </Row>
            <Link href="/report/daily-report">
                <h4 className="text-sm flex items-center font-semibold mb-2 mt-6 underline" >View detail analysis <ArrowRight className='ml-2 text-gray-700'/></h4>
            </Link>
            {/* <Line {...lineConfig([revenueData], 'totalRevenue', 'Total Revenue')} /> */}
        </Form>
    );
};

export default DashBoard;
