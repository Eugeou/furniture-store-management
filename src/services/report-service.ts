import axiosClient from "@/lib/axios";
import { ReportRevenue } from "@/types/entities/report-entity";

export const GetTotalRevenueReport = async (): Promise<ReportRevenue> => {
    const { data } = await axiosClient.get("/analysis/summary");
    return data;
}

export const GetDailyRevenue = async (fromDate: string, toDate: string): Promise<ReportRevenue[]> => {
    const { data } = await axiosClient.get(`//analysis/order-analytics?startDate=${fromDate}&endDate=${toDate}`);
    return data;
}

export const GetDailyExpense = async (fromDate: string, toDate: string): Promise<ReportRevenue[]> => {
    const { data } = await axiosClient.get(`//analysis/order-analytics?startDate=${fromDate}&endDate=${toDate}`);
    return data;
}