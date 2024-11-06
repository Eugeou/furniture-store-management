import axios, { AxiosResponse } from "axios";
import envConfig from "@/configs/config";
import { Material, CreatedMaterial } from "@/types/entities/material-entity";
import { ParseJSON } from "@/configs/parseJSON";

const MaterialUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + "/material";
const getAccessToken = () => (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
const accessToken = getAccessToken();

export const CreateMaterial = async (material: CreatedMaterial) => {
    

    if (!accessToken) {
        throw new Error("No access token found");
    }

    const formData = new FormData();
    formData.append("MaterialName", material.MaterialName);
    formData.append("Description", material.Description);
    formData.append("ImageSource", material.ImageSource);

    const config = {
        method: "post",
        url: MaterialUrl,
        headers: {
            "Authorization": `Bearer ${ParseJSON(accessToken)}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error("Add material failed:", error);
        throw error;
    }
};

export const GetAllMaterial = async (): Promise<Material[]> => {

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);
    
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: MaterialUrl,
            headers: {
              "Authorization": `Bearer ${parseToken}`,
            }
          };
        
          const response: AxiosResponse<Material[]> = await axios.request(config);
          return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Get all material failed');
    }
};

export const DeleteMaterial = async (id: string) => {

    if (!accessToken) {
        throw new Error("No access token found");
    }

    const parseToken = ParseJSON(accessToken);

    const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: MaterialUrl + "/" + id,
        headers: {
            "Authorization": `Bearer ${parseToken}`,
        },
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
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

export const EditMaterial = async ( id: string, material: CreatedMaterial) => {

    if (!accessToken) {
        throw new Error("No access token found");
    }

    const formData = new FormData();
    formData.append("MaterialName", material.MaterialName);
    formData.append("Description", material.Description);
    formData.append("ImageSource", material.ImageSource);

    const config = {
        method: "put",
        url: MaterialUrl + "/" + id,
        headers: {
            "Authorization": `Bearer ${ParseJSON(accessToken)}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error("Edit material failed:", error);
        throw error;
    }
};





