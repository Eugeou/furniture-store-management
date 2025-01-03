
export type NotificationEntity = {
    Id: string;
    Content: string;
    Title: string;
    OrderId: string;
    //Order: OrderEntity | null;
    UserId: string;
    //User: UserEntity | null;
    CreateDate: string;
};

export type CreateNotification = {
    content: string;
    title: string;
    orderId: string;
    userId: string;
};