export type RoomSpace = {
    Id: string;
    RoomSpaceName: string;
    Description: string;
    ImageSource: string;
};

export type CreatedRoomSpace = {
    RoomSpaceName: string;
    Description: string;
    ImageSource: File[];
}