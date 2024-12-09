export type Category = {
    Id: string;
    CategoryName: string;
    Description: string;
    Image: string;
    FurnitureTypeId: string;
};

export type CreatedCategory = {
    CategoryName: string;
    FurnitureTypeId: string;
    Description: string;
    Image: File[];
}