import axios, { AxiosResponse } from "axios";
import envConfig from "@/configs/config";
import { Material, CreatedMaterial } from "@/types/entities/material-entity";
import axiosClient from "@/lib/axios";


export const CreateMaterial = async (material: CreatedMaterial) => {

    const formData = new FormData();
    formData.append("MaterialName", material.MaterialName);
    formData.append("Description", material.Description);
    formData.append("ImageSource", material.ImageSource);

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/material", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add material failed:", error);
        throw error;
    }
};

export const GetAllMaterial = async (): Promise<Material[]> => {
    const { data } = await axiosClient.get("/material");
    return data;
};

export const DeleteMaterial = async (id: string) => {
    return await axiosClient.delete(`/material/${id}`);
};

export const EditMaterial = async ( id: string, material: CreatedMaterial) => {

    const formData = new FormData();
    formData.append("MaterialName", material.MaterialName);
    formData.append("Description", material.Description);
    formData.append("ImageSource", material.ImageSource);

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/material/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit material failed:", error);
        throw error;
    }
};





