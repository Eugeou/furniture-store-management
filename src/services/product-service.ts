
// import axios from 'axios';
// import { CreateProductForm } from '@/src/types';
// import envConfig from '@/configs/config';


// const AddProductUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT + '/products';
// const accessToken = localStorage.getItem('access_token');

// export const AddProduct = async (data: CreateProductForm) => {
//   const formData = new FormData();
  
//   // Append productRequest fields
//   formData.append('product_Name', data.productRequest.product_Name);
//   formData.append('description', data.productRequest.description);
//   formData.append('price', data.productRequest.price.toString());
//   formData.append('category', data.productRequest.category);
//   formData.append('branch', data.productRequest.branch);

//   data.productRequest.productItemRequests.forEach((item, index) => {
//     formData.append(`productItemRequests[${index}].size`, item.size.toString());
//     formData.append(`productItemRequests[${index}].color`, item.color.toString());
//   });

//   // Append images
//   for (let i = 0; i < data.images.length; i++) {
//     formData.append('images', data.images[i]);
//   }

//   if (!accessToken) {
//     throw new Error('No access token found');
//   }

//   const parseToken = ParseJSON(accessToken);

//   const response = await axios.post(AddProductUrl, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       'Authorization': `Bearer ${parseToken}`,
//     },
//   });

//   return response.data;
// };


