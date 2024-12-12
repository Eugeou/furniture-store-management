import { Coupon, ExistedCoupon } from "@/types/entities/coupon-entity";
import axiosClient from "@/lib/axios";

export const CreateCoupon = async (coupon: Coupon): Promise<void> => {
    const data = new FormData();

    data.append('Description', coupon.Description ?? '');
    data?.append('Quantity', coupon.Quantity?.toString() ?? '');
    data.append('StartDate', coupon.StartDate);
    data.append('EndDate', coupon.EndDate);
    data?.append('DiscountValue', coupon.DiscountValue.toString());
    data?.append('MinOrderValue', coupon.MinOrderValue.toString());
    data.append('ECouponType', coupon.ECouponType);
    if (coupon.Image) {
        data.append('Image', coupon.Image);
    }

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.post("/coupon", data, config);
        return response.data;
    } catch (error) {
        console.error('Create coupon failed:', error);
        throw error;
    }
}

export const GetAllCoupons = async (): Promise<ExistedCoupon[]> => {
    const { data } = await axiosClient.get('/coupon');
    return data;
};

export const DeleteCoupon = async (id: string) => {
    return await axiosClient.delete(`/coupon/${id}`);
};

export const GetDetailCoupon = async (id: string): Promise<ExistedCoupon> => {
    const { data } = await axiosClient.get(`/coupon/${id}`);
    return data;
};

export const UpdateCoupon = async (id: string, coupon: Coupon): Promise<void> => {
    const data = new FormData();

    data.append('Description', coupon.Description ?? '');
    data.append('Quantity', coupon.Quantity?.toString() ?? '');
    data.append('StartDate', coupon.StartDate);
    data.append('EndDate', coupon.EndDate);
    data.append('DiscountValue', coupon.DiscountValue.toString());
    data.append('MinOrderValue', coupon.MinOrderValue.toString());
    data.append('ECouponType', coupon.ECouponType);
    if (coupon.Image) {
        data.append('Image', coupon.Image);
    }

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await axiosClient.put(`/coupon/${id}`, data, config);
        return response.data;
    } catch (error) {
        console.error('Update coupon failed:', error);
        throw error;
    }
};

