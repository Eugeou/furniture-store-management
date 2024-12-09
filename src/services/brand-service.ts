import { Brand, CreatedBrand } from "@/types/entities/brand-entity";
import axiosClient from "@/lib/axios";

// export const CreateBrand = async (brand: CreatedBrand) => {
//     const formData = new FormData();
//     formData.append("BrandName", brand.BrandName);
//     formData.append("Description", brand.Description);
//     formData.append("ImageSource", brand.ImageSource);

//     const config = {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//     };

//     try {
//         const response = await axiosClient.post("/brand", formData, config);
//         return response.data;
//     } catch (error) {
//         console.error("Add branch failed:", error);
//         throw error;
//     }
// };

export const CreateBrand = async (brand: CreatedBrand) => {
    const formData = new FormData();
    formData.append("BrandName", brand.BrandName);
    formData.append("Description", brand.Description);

    if (brand.ImageSource instanceof File) {
        formData.append("ImageSource", brand.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/brand", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add branch failed:", error);
        throw error;
    }
};


export const GetAllBrand = async (): Promise<Brand[]> => {
    const { data } = await axiosClient.get("/brand");
    return data;
};

export const DeleteBrand = async (id: string) => {
    return await axiosClient.delete(`/brand/${id}`);
};


export const EditBrand = async ( id: string, brand: CreatedBrand) => {
    const formData = new FormData();
    formData.append("BrandName", brand.BrandName);
    formData.append("Description", brand.Description);
    
    if (brand.ImageSource instanceof File) {
        formData.append("ImageSource", brand.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/brand/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit branch failed:", error);
        throw error;
    }
};