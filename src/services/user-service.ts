import axiosClient from "@/lib/axios";

export const ChangeAvatar = async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await axiosClient.post(`/user/avatar/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}