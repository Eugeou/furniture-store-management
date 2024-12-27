import axiosClient from "@/lib/axios";
import { AddImportItem } from "@/types/entities/import-entity";

export const ImportProduct = async (data: AddImportItem[]) => {

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axiosClient.post("/import", data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}