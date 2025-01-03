import { CreateNotification } from "../types/entities/notification-entity";
import axiosClient from "../lib/axios";

export const getNotifications = async (id : string) =>  {
    const { data } = await axiosClient.get(`/notification/${id}`);
    return data;
};

export const CreateNewNotification = async (notification: CreateNotification) => {
    try {
        const response = await axiosClient.post("/notification", notification);
        return response.data;
    } catch (error) {
        console.error("Add notification failed:", error);
        //throw error;
    }
};