import { RoomSpace, CreatedRoomSpace } from "@/types/entities/roomspace-entity";
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

export const CreateRoomSpace = async (roomspace: CreatedRoomSpace) => {
    const formData = new FormData();
    formData.append("RoomSpaceName", roomspace.RoomSpaceName);
    formData.append("Description", roomspace.Description);

    if (roomspace.ImageSource instanceof File) {
        formData.append("ImageSource", roomspace.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/roomspace", formData, config);
        return response.data;
    } catch (error) {
        console.error("Add room space failed:", error);
        throw error;
    }
};


export const GetAllRoomSpace = async (): Promise<RoomSpace[]> => {
    const { data } = await axiosClient.get("/roomspace");
    return data;
};

export const DeleteRoomSpace = async (roomSpaceId: string) => {
    return await axiosClient.delete(`/roomspace/${roomSpaceId}`);
};


export const EditRoomSpace = async ( id: string, roomspace: CreatedRoomSpace) => {
    const formData = new FormData();
    formData.append("RoomSpaceName", roomspace.RoomSpaceName);
    formData.append("Description", roomspace.Description);

    if (roomspace.ImageSource instanceof File) {
        formData.append("ImageSource", roomspace.ImageSource);
    }


    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/roomspace/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error("Edit room space failed:", error);
        throw error;
    }
};