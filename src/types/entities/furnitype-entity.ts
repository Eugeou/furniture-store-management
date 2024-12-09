export type Furnitype = {
    Id: string;
    FurnitureTypeName: string;
    Description: string;
    ImageSource: string;
    RoomSpaceId: string;
};

export type CreatedFurnitype = {
    FurnitureTypeName: string;
    Description: string;
    ImageSource: File[];
    RoomSpaceId: string;
}