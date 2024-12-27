import axiosClient from "@/lib/axios";
import { AddImportItem } from "@/types/entities/import-entity";

export const ImportProduct = async (data: AddImportItem[]) => {
    const formData = new FormData();
    data?.forEach((item) => {
        formData.append('productItemId', item.productVariantId);
        formData.append('quantity', item.quantity.toString());
        formData.append('price', item.price.toString());
        formData.append('total', item.total.toString());
    });

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/import", formData, config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}