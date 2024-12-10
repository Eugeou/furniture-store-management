export interface Product {
    Id: string;
    ProductName: string;
    Unit: string;
    Description: string;
    price: number;
    CategoryId: string;
    BrandId: string;
    DesignerId: string[];
    MaterialId: string[];
    //ProductVariant: ProductVariant[];
    Discount: number;
    Thumbnail: string;
}

export interface ProductRequest {
    ProductName: string;
    Description: string;
    
    category: string;
    branch: string;
    productItemRequests: ProductItemRequest[];
  }
  
export interface ProductItemRequest {
    size: number;
    color: number;
}
  
export interface CreateProductForm {
    productRequest: ProductRequest;
    Thumbnail: FileList;
}


//Concrete product
export interface ProductItem {
    id: string;
    sizeName: string;
    colorName: string;
    quantity: number;
    price: number;
}