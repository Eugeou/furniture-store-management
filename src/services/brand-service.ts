import axios, { AxiosResponse } from "axios";
import envConfig from "@/configs/config";
import { Brand, CreatedBrand } from "@/types/entities/brand-entity";
import { ParseJSON } from "@/configs/parseJSON";
import axiosClient from "@/lib/axios";

const BrandUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + "/brand";

const accessToken = localStorage.getItem("accessToken");

export const CreateBrand = async (brand: CreatedBrand) => {
    
    const formData = new FormData();
    formData.append("BrandName", brand.BrandName);
    formData.append("Description", brand.Description);
    formData.append("ImageSource", brand.ImageSource);

    const config = {
        method: "post",
        url: BrandUrl,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    };

    try {
        const response = await axios(config);
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



// export const DeleteBrand = async (id: string) => {

//     const DeleteURL = envConfig.NEXT_PUBLIC_API_ENDPOINT + `/brand/${id}`;

//     const config = {
//         method: "delete",
//         maxBodyLength: Infinity,
//         url: DeleteURL,
//         headers: {
//             "Authorization": `Bearer ${accessToken}`,
//         },
//     };
//     try {
//         const response = await axios.request(config);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// };

export const DeleteBrand = async (id: string) => {
    return await axiosClient.delete(`/brand/${id}`);
};


// export const EditBrand = async (id: string, brandName: string, description: string, image: string) => {

//     const EditBranchUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + `/brand/${id}`;

//     if (!accessToken) {
//         throw new Error("No access token found");
//     }

//     const parseToken = ParseJSON(accessToken);

//     try {
//         const config = {
//             method: "put",
//             maxBodyLength: Infinity,
//             url: EditBranchUrl,
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${parseToken}`,
//             },
//             data: JSON.stringify({ brandName, description, image }),
//         };
//         const response = await axios.request(config);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// };

export const EditBrand = async ( id: string, brand: CreatedBrand) => {
    const EditBranchUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + `/brand/${id}`;
    const formData = new FormData();
    formData.append("Name", brand.BrandName);
    formData.append("Description", brand.Description);
    formData.append("ImageSource", brand.ImageSource);

    const config = {
        method: "put",
        url: EditBranchUrl,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error("Edit branch failed:", error);
        throw error;
    }
};





