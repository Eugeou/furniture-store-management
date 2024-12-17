import axiosClient from "@/lib/axios";
import { CustomerEntity, CreateCustomer } from "@/types/entities/customer-entity";

export const GetAllCustomers = async (): Promise<CustomerEntity[]> => {
    const { data } = await axiosClient.get("/customer");
    return data;
}

export const GetDetailCustomer = async (id: string): Promise<CustomerEntity> => {
    const { data } = await axiosClient.get(`/customer/${id}`);
    return data;
}

export const DeleteCustomer = async (id: string) => {
    return await axiosClient.delete(`/customer/${id}`);    
}

export const BanCustomer = async (id: string) => {
    return await axiosClient.put(`/customer/ban/${id}`);
}

export const UnBanCustomer = async (id: string) => {
    return await axiosClient.put(`/customer/unban/${id}`);
}

export const CreateNewCustomer = async (customer: CreateCustomer) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await axiosClient.post("/customer", customer, config);
}
