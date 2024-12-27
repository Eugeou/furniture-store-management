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
    productItem: string;
    quantity: number;
    price: number;
    total: number;
}

export interface ImportDetailResponse {
    importResponse: {
        id: string;
        total: number;
    };
    importItemResponseList: ImportItemResponse[];
}
