import { Designer, CreatedDesigner } from "@/types/entities/designer-entity";
import axiosClient from "@/lib/axios";



export const CreateDesigner = async (designer: CreatedDesigner) => {
    const formData = new FormData();
    formData.append("DesignerName", designer.DesignerName);
    formData.append("Description", designer.Description);

    if (designer.ImageSource instanceof File) {
        formData.append("ImageSource", designer.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/designer", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add designer failed:", error);
        throw error;
    }
};


export const GetAllDesigner = async (): Promise<Designer[]> => {
    const { data } = await axiosClient.get("/designer");
    return data;
};

export const DeleteDesigner = async (id: string) => {
    return await axiosClient.delete(`/designer/${id}`);
};


export const EditDesigner = async ( id: string, Designer: CreatedDesigner) => {
    const formData = new FormData();
    formData.append("DesignerName", Designer.DesignerName);
    formData.append("Description", Designer.Description);
    
    if (Designer.ImageSource instanceof File) {
        formData.append("ImageSource", Designer.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/designer/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit designer failed:", error);
        throw error;
    }
};