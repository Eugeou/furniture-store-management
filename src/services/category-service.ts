import { CreatedCategory, Category } from "@/types/entities/category-entity";
import axiosClient from "@/lib/axios";

export const CreateCategory = async (category: CreatedCategory) => {
    const formData = new FormData();
    formData.append("CategoryName", category.CategoryName);
    formData.append("Description", category.Description);

    if (category.Image instanceof File) {
        formData.append("Image", category.Image);
    }

    formData.append("FurnitureTypeId", category.FurnitureTypeId);


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/category", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add category failed:", error);
        throw error;
    }
};


export const GetAllCategory = async (): Promise<Category[]> => {
    const { data } = await axiosClient.get("/category");
    return data;
};

export const DeleteCategory = async (categoryId: string) => {
    return await axiosClient.delete(`/category/${categoryId}`);
};


export const EditCategory = async ( id: string, category: CreatedCategory) => {
    const formData = new FormData();
    formData.append("CategoryName", category.CategoryName);
    formData.append("Description", category.Description);

    if (category.Image instanceof File) {
        formData.append("Image", category.Image);
    }

    formData.append("FurnitureTypeId", category.FurnitureTypeId);


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/category/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit Category failed:", error);
        throw error;
    }
};