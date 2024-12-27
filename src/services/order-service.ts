import axiosClient from "@/lib/axios";
import { OrderEntity, OrderStatus } from "@/types/entities/order-entity";

export const GetAllOrders = async (): Promise<OrderEntity[]> => {
    const { data } = await axiosClient.get("/order");
    return data;
}

export const ChangeOrderStatus = async (id: string, EOrderStatus: string) => {
    console.log(EOrderStatus);

    // Tạo đối tượng FormData
    const formData = new FormData();
    formData.append("EOrderStatus", EOrderStatus); // Thêm giá trị trạng thái đơn hàng

    // Gửi yêu cầu API với FormData
    return await axiosClient.put(`/order/${id}/status`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo Content-Type là multipart/form-data
        },
    });
};