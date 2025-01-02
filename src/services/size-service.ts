import { Size, AddSize } from "@/types/entities/size-entity";
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

export const CreateSize = async (size : AddSize) => {
    const formData = new FormData();
    formData.append("SizeName", size.SizeName);
    formData.append("Length", size.Length.toString());
    formData.append("Width", size.Width.toString());
    formData.append("HumanHeight", size.HumanHeight.toString());

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/size", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add branch failed:", error);
        throw error;
    }
};


export const GetAllSize = async () : Promise<Size[]> => {
    const response = await axiosClient.get("/size");
    return response.data;
};

export const DeleteSize = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/size/${id}`);
        return response.data;
    } catch (error) {
        console.error("Delete size failed:", error);
        //throw error;
    }
};


export const EditSize = async (id: string, size: AddSize) => {
    const formData = new FormData();
    formData.append("SizeName", size.SizeName);
    formData.append("Length", size.Length.toString());
    formData.append("Width", size.Width.toString());
    formData.append("HumanHeight", size.HumanHeight.toString());

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/size/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit size failed:", error);
        throw error;
    }
};