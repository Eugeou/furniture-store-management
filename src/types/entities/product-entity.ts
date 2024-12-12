export type ProductVariant = {
    colorId: string;
    length: number;
    width: number;
    height: number;
    quantity: number;
    price: number;
    images: File[];
  };
  
  export type Product = {
    ProductName: string;
    Unit: string;
    Description: string;
    BrandId: string;
    CategoryId: string;
    DesignersId: string[];
    MaterialsId: string[];
    Discount?: number;
    Thumbnail: File;
    ProductVariants: ProductVariant[];
  };
  