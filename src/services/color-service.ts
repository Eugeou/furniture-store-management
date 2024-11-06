import axios from 'axios';
import envConfig from '@/configs/config';
import { Colors, CreatedColor } from '@/types/entities/color-entity';
import { ParseJSON } from '@/configs/parseJSON';

const ColorUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + '/color';
const getAccessToken = () => (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
const accessToken = getAccessToken();
const parseToken = (accessToken) ? ParseJSON(accessToken) : null;

export const AddColors = async ({ ColorName, ColorCode}: CreatedColor): Promise<void> => {
    
    if (!accessToken) {
        throw new Error('No access token found');
    }
    
    const formData = new FormData();
    formData.append('ColorName', ColorName);
    formData.append('ColorCode', ColorCode);
    
    const config = {
        method: 'post',
        url: ColorUrl,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${parseToken}`,
        },
        data: formData,
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error("Add branch failed:", error);
        throw error;
    }
}

export const GetAllColors = async (): Promise<Colors[]> => {
    
    if (!accessToken) {
        throw new Error('No access token found');
    }
    
    const config = {
        method: 'get',
        url: ColorUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
        },
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const DeleteColor = async (colorId: string): Promise<void> => {
    
    if (!accessToken) {
        throw new Error('No access token found');
    }
    
    const config = {
        method: 'delete',
        url: ColorUrl + '/' + colorId,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
        },
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const EditColor = async ({ Id, ColorName, ColorCode }: Colors): Promise<void> => {
    
    if (!accessToken) {
        throw new Error('No access token found');
    }
    
    const config = {
        method: 'put',
        url: ColorUrl + '/' + Id,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parseToken}`,
        },
        data: JSON.stringify({ ColorName, ColorCode }),
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error(error);
        throw error;
    }
}
