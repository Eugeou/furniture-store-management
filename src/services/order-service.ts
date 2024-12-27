import axiosClient from "@/lib/axios";
import { OrderEntity } from "@/types/entities/order-entity";

export const GetAllOrders = async (): Promise<OrderEntity[]> => {
    const { data } = await axiosClient.get("/order");
    return data;
}

export const ChangeOrderStatus = async (id: string, EOrderStatus: number) => {
    return await axiosClient.put(`/order/${id}/status`, {EOrderStatus: EOrderStatus});
}