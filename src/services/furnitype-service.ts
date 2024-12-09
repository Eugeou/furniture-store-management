import { Furnitype, CreatedFurnitype } from "@/types/entities/furnitype-entity";
import axiosClient from "@/lib/axios";

export const CreateFurnitype = async (furnitype: CreatedFurnitype) => {
    const formData = new FormData();
    formData.append("FurnitureTypeName", furnitype.FurnitureTypeName);
    formData.append("Description", furnitype.Description);

    if (furnitype.ImageSource instanceof File) {
        formData.append("ImageSource", furnitype.ImageSource);
    }

    formData.append("RoomSpaceId", furnitype.RoomSpaceId);


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/furnitureType", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add furnitype failed:", error);
        throw error;
    }
};


export const GetAllFurnitype = async (): Promise<Furnitype[]> => {
    const { data } = await axiosClient.get("/furnitureType");
    return data;
};

export const DeleteFurnitype = async (furnitureTypeId: string) => {
    return await axiosClient.delete(`/furnitureType/${furnitureTypeId}`);
};


export const EditFurnitype = async ( id: string, furniType: CreatedFurnitype) => {
    const formData = new FormData();
    formData.append("FurnitureTypeName", furniType.FurnitureTypeName);
    formData.append("Description", furniType.Description);

    if (furniType.ImageSource instanceof File) {
        formData.append("ImageSource", furniType.ImageSource);
    }

    formData.append("RoomSpaceId", furniType.RoomSpaceId);


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/furnitureType/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit furnitype failed:", error);
        throw error;
    }
};