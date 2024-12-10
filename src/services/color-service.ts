import { Colors, CreatedColor } from '@/types/entities/color-entity';
import axiosClient from '@/lib/axios';

export const AddColors = async ({ ColorName, ColorCode}: CreatedColor): Promise<void> => {

    const formData = new FormData();
    formData.append('ColorName', ColorName);
    formData.append('ColorCode', ColorCode);
    
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/color", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add color failed:", error);
        throw error;
    }
}

export const GetAllColors = async (): Promise<Colors[]> => {
    const { data } = await axiosClient.get("/color");
    return data;
}

export const DeleteColor = async (colorId: string): Promise<void> => {
    return await axiosClient.delete(`/color/${colorId}`);
}

export const EditColor = async ({ Id, ColorName, ColorCode }: Colors): Promise<void> => {
    
    const formData = new FormData();
    formData.append('ColorName', ColorName);
    formData.append('ColorCode', ColorCode);

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/color/${Id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit color failed:", error);
        throw error;
    }
}
