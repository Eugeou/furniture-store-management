// "use client";

// import { useState, useEffect } from 'react';
// import useSWR from 'swr';
// import { Upload, Button, Input, Select, Table, Form, Tag } from 'antd';
// import { toast } from 'react-toastify';
// import { UpdateProduct, GetDetailProduct } from '@/services/product-service';
// import type { Product, ProductVariant } from '@/types/entities/product-entity';
// import { GetAllBrand } from '@/services/brand-service';
// import { GetAllCategory } from '@/services/category-service';
// import { GetAllDesigner } from '@/services/designer-service';
// import { GetAllMaterial } from '@/services/material-service';
// import { GetAllColors } from '@/services/color-service';
// import { useRouter, useParams } from 'next/navigation';

// const EditProduct: React.FC = () => {
//   const [form] = Form.useForm();
//   const [thumbnail, setThumbnail] = useState<File | null>(null);
//   const [variants, setVariants] = useState<ProductVariant[]>([]);
//   const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariant>>({});
//   const [loading, setLoading] = useState(false);
//   const [productData, setProductData] = useState<Product | null>(null);

//   const { id } = useParams(); // Get product ID from the URL
//   const router = useRouter();

//   // Fetch auxiliary data
//   const { data: brands } = useSWR('/brand', GetAllBrand, { fallbackData: [] });
//   const { data: categories } = useSWR('/category', GetAllCategory, { fallbackData: [] });
//   const { data: designers } = useSWR('/designer', GetAllDesigner, { fallbackData: [] });
//   const { data: materials } = useSWR('/material', GetAllMaterial, { fallbackData: [] });
//   const { data: colors } = useSWR('/color', GetAllColors, { fallbackData: [] });

//   // Fetch product details on load
//   useEffect(() => {
//     if (id) {
//       try {
//         const fetchProduct = async () => {
//           const product = await GetDetailProduct(id);
//           setProductData(product);
//           form.setFieldsValue(product);
//           setVariants(product.ProductVariants || []);
//         };

//         fetchProduct();
//       } catch (error) {
//         toast.error(`Error fetching product: ${error}`);
//       }
//     }
//   }, [id]);

//   const handleAddVariant = () => {
//     if (!currentVariant.colorId || !currentVariant.images?.length) {
//       toast.error('Product Color and Images are required for a variant.');
//       return;
//     }

//     const newVariant: ProductVariant = {
//       colorId: currentVariant.colorId,
//       length: currentVariant.length ?? 0,
//       width: currentVariant.width ?? 0,
//       height: currentVariant.height ?? 0,
//       images: currentVariant.images ?? [],
//     };

//     setVariants([...variants, newVariant]);
//     setCurrentVariant({});
//   };

//   const handleSubmit = async (values: Product) => {
//     try {
//       setLoading(true);
//       await UpdateProduct(id, { ...values, ProductVariants: variants });
//       toast.success('Product updated successfully!');
//       router.push('/product'); // Navigate back to product list
//     } catch (error) {
//       toast.error(`Error updating product: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//         <h2 className="font-bold mb-4 border-b text-indigo-600 text-lg">Product information</h2>
//       <Form layout="vertical" form={form} className='font-semibold'>
//         <Form.Item name="ProductName" label="Product Name" rules={[{ required: true }]}>
//           <Input placeholder="Enter product name" />
//         </Form.Item>

//         <Form.Item name="Unit" label="Unit" rules={[{ required: true }]}>
//           <Input placeholder="Enter unit" />
//         </Form.Item>

//         <Form.Item name="Description" label="Description" rules={[{ required: true }]}>
//           <Input.TextArea rows={3} placeholder="Enter description" />
//         </Form.Item>

//         <Form.Item name="Discount" label="Discount (%)" rules={[{ required: true }]} getValueFromEvent={(e) => parseFloat(e.target.value)}>
//           <Input type="number" placeholder="Enter discount percentage" />
//         </Form.Item>

//         <Form.Item name="BrandId" label="Brand" rules={[{ required: true }]}>
//           <Select placeholder="Select a brand" options={brands?.map((brand) => ({ label: brand.BrandName, value: brand.Id }))} />
//         </Form.Item>

//         <Form.Item name="CategoryId" label="Category" rules={[{ required: true }]}>
//           <Select placeholder="Select a category" options={categories?.map((category) => ({ label: category.CategoryName, value: category.Id }))} />
//         </Form.Item>

//         <Form.Item name="DesignersId" label="Designers" rules={[{ required: true }]}>
//           <Select
//             mode="multiple"
//             placeholder="Select designers"
//             options={designers?.map((designer) => ({ label: designer.DesignerName, value: designer.Id }))}
//           />
//         </Form.Item>

//         <Form.Item name="MaterialsId" label="Materials" rules={[{ required: true }]}>
//           <Select
//             mode="multiple"
//             placeholder="Select materials"
//             options={materials?.map((material) => ({ label: material.MaterialName, value: material.Id }))}
//           />
//         </Form.Item>

//         <Form.Item label="Thumbnail">
//           <Upload
//             beforeUpload={(file) => {
//               setThumbnail(file);
//               return false;
//             }}
//             listType='picture-card'
//             maxCount={1}
//           >
//             <Button icon={<UploadIcon />}></Button>
//           </Upload>
//         </Form.Item>

//         <div className="border-t mt-4 pt-4">
//           <h2 className="font-bold mb-4 border-b text-indigo-600 text-lg">Product Variants</h2>

//           <div className="grid grid-cols-2 gap-4">
//             <Select
//               placeholder="Select Color"
//               options={colors?.map((color) => ({ label: color.ColorName, value: color.Id })) || []}
//               onChange={(value) => setCurrentVariant({ ...currentVariant, colorId: value })}
//             />
//             <Input
//               placeholder="Furniture Length"
//               type="number"
//               onChange={(e) => setCurrentVariant({ ...currentVariant, length: parseFloat(e.target.value) })}
//             />
//             <Input
//               placeholder="Furniture Width"
//               type="number"
//               onChange={(e) => setCurrentVariant({ ...currentVariant, width: parseFloat(e.target.value) })}
//             />
//             <Input
//               placeholder="Furniture Height"
//               type="number"
//               onChange={(e) => setCurrentVariant({ ...currentVariant, height: parseFloat(e.target.value) })}
//             />
//             <Input
//               placeholder="Quantity"
//               type="number"
//               onChange={(e) => setCurrentVariant({ ...currentVariant, quantity: parseInt(e.target.value, 10) })}
//             />
//             <Input
//               placeholder="Furniture Price"
//               type="number"
//               onChange={(e) => setCurrentVariant({ ...currentVariant, price: parseFloat(e.target.value) })}
//             />
//             <Upload
//               multiple
//               beforeUpload={(file) => {
//                 const images = currentVariant.images || [];
//                 setCurrentVariant({ ...currentVariant, images: [...images, file] });
//                 return false;
//               }}
//                 listType='picture-card'
//             >
//               <Button icon={<UploadIcon />}></Button>
//             </Upload>
//           </div>

//           <Button onClick={handleAddVariant} className="mt-4">Add Variant</Button>
//         </div>

//         <Table title={() => 'Product Variants'} dataSource={variants} columns={columns} rowKey="colorId" className="mt-4 border border-gray-300 rounded-sm"/>

//         <Button
//           type="primary"
//           loading={loading}
//           className="mt-4 font-semibold"
//           onClick={handleSubmit}
//         >
//           Create Product
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default EditProduct;
