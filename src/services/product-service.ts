// api/createProduct.ts
import axios from 'axios';
import FormData from 'form-data';
import { Product, ProductGet } from '@/types/entities/product-entity';
import axiosClient from '@/lib/axios';

export const createProduct = async (product: Product): Promise<void> => {
  const data = new FormData();

  data.append('ProductName', product.ProductName);
  data.append('Unit', product.Unit);
  data.append('Description', product.Description);
  data.append('Thumbnail', product.Thumbnail);
  data.append('BrandId', product.BrandId);
  data.append('CategoryId', product.CategoryId);

  //product?.DesignersId.forEach((id, index) => data.append(`DesignersId[${index}]`, id));
  product?.MaterialsId.forEach((id, index) => data.append(`MaterialsId[${index}]`, id));

  if (product.Discount) {
    data.append('Discount', product.Discount.toString());
  }

  product.ProductVariants?.forEach((variant, index) => {
    data.append(`ProductVariants[${index}].colorId`, variant.colorId);
    data.append(`ProductVariants[${index}].sizeId`, variant.sizeId);
    // data.append(`ProductVariants[${index}].length`, variant.length.toString());
    // data.append(`ProductVariants[${index}].width`, variant.width.toString());
    // data.append(`ProductVariants[${index}].height`, variant.height.toString());
    // data.append(`ProductVariants[${index}].quantity`, variant.quantity.toString());
    data.append(`ProductVariants[${index}].price`, variant.price.toString());
    variant.images?.forEach((image) =>
      data.append(`ProductVariants[${index}].Images`, image)
    );
  });

  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
    };

  
    try {
        const response = await axiosClient.post("/product", data, config);
        return response.data;
    } catch (error) {
        console.error('Create product failed:', error);
        throw error;
    }
};

export const GetAllProducts = async (): Promise<ProductGet[]> => {
  const { data } = await axiosClient.get('/product');
  return data;
};

export const DeleteProduct = async (id: string) => {
  return await axiosClient.delete(`/product/${id}`);
};

export const GetDetailProduct = async (id: string): Promise<ProductGet> => {
  const { data } = await axiosClient.get(`/product/${id}`);
  return data;
};

export const UpdateProduct = async (id: string, product: Product): Promise<void> => {
  const data = new FormData();

  data.append('ProductName', product.ProductName);
  data.append('Unit', product.Unit);
  data.append('Description', product.Description);
  data.append('Thumbnail', product.Thumbnail);
  data.append('BrandId', product.BrandId);
  data.append('CategoryId', product.CategoryId);

  //product?.DesignersId.forEach((id, index) => data.append(`DesignersId[${index}]`, id));
  product?.MaterialsId.forEach((id, index) => data.append(`MaterialsId[${index}]`, id));

  if (product.Discount) {
    data.append('Discount', product.Discount.toString());
  }

  product.ProductVariants?.forEach((variant, index) => {
    data.append(`ProductVariants[${index}].colorId`, variant.colorId);
    data.append(`ProductVariants[${index}].sizeId`, variant.sizeId);
    // data.append(`ProductVariants[${index}].length`, variant.length.toString());
    // data.append(`ProductVariants[${index}].width`, variant.width.toString());
    // data.append(`ProductVariants[${index}].height`, variant.height.toString());
    // data.append(`ProductVariants[${index}].quantity`, variant.quantity.toString());
    data.append(`ProductVariants[${index}].price`, variant.price.toString());
    variant.images?.forEach((image) =>
      data.append(`ProductVariants[${index}].Images`, image)
    );
  });

  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
    };

  
    try {
        const response = await axiosClient.put(`/product/${id}`, data, config);
        return response.data;
    } catch (error) {
        console.error('Edit product failed:', error);
        throw error;
    }
};