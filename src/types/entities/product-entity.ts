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

  export type ProductGet = {
    Id: string;
    ProductName: string;
    Unit: string;
    Description: string;
    BrandName: string;
    CategoryName: string;
    Designers: string[];
    Materials: string[];
    DisplayPrice: string;
    Discount?: number;
    ImageSource: string;
    ProductVariants: ProductVariantGet[];
  };

  export type ProductVariantGet = {
    Id: string;
    ColorId: string;
    ColorName: string;
    DisplayDimension: string;
    Quantity: number;
    Price: number;
    ImageSource: string[];
  };

  