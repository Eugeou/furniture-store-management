export type Brand = {
    Id: string;
    BrandName: string;
    Description: string;
    ImageSource: string;
};

export type CreatedBrand = {
    BrandName: string;
    Description: string;
    ImageSource: File;
}