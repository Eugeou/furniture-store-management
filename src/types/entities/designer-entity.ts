export type Designer = {
    Id: string;
    DesignerName: string;
    Description: string;
    ImageSource: string;
};

export type CreatedDesigner = {
    DesignerName: string;
    Description: string;
    ImageSource: File[];
};