import axiosClient from "@/lib/axios";
import { StaffEntity, CreateStaff, UpdateStaff } from "@/types/entities/staff-entity";

export const GetAllStaffs = async (): Promise<StaffEntity[]> => {
    const { data } = await axiosClient.get("/staff");
    return data;
}

export const GetDetailStaff = async (id: string): Promise<StaffEntity> => {
    const { data } = await axiosClient.get(`/staff/${id}`);
    return data;
}

export const DeleteStaff = async (id: string) => {
    return await axiosClient.delete(`/staff/${id}`);    
}

export const BanStaff = async (id: string) => {
    return await axiosClient.put(`/staff/ban/${id}`);
}

export const UnBanStaff = async (id: string) => {
    return await axiosClient.put(`/staff/unban/${id}`);
}

export const CreateNewStaff = async (Staff: CreateStaff) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await axiosClient.post("/staff", Staff, config);
}

export const EditStaff = async (id: string, Staff: UpdateStaff) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await axiosClient.put(`/staff/${id}`, Staff, config);
}
