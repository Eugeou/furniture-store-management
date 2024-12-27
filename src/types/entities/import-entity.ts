export interface AddImportItem {
    productVariantId: string;
    quantity: number;
    price: number;
    total: number;
}

export interface ImportInvoice {
    createdAt: string;
    updatedAt: string;

    createdBy: string;
    updatedBy: string;

    id: string;
    total: number;
    
}


export interface ImportItemResponse {
    ProductVariantId: string;
    ProductName: string;
    Quantity: number;
    Price: number;
    Total: number;
}

export interface ImportDetailResponse {
    Id : string;
    Total: number;
    ImportItemResponse: ImportItemResponse[];
}
