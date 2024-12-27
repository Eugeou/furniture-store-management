
export type OrderEntity = {
    Id: string;
    PhoneNumber: string;
    Email: string;
    PaymentMethod: string;
    CanceledAt: string;
    CompletedAt: string;
    DeliveredAt: string;
    Note: string;
    ShippingFee: number;
    OrderStatus: string;
    UserId: string;
    FullName: string;
    Address: AddressEntity;
    TaxFee: number;
    SubTotal: number;
    Total: number;
    AccountsReceivable: number;
    OrderItemResponses: string[];
}

export type AddressEntity = {
    Id: string;
    Province: string;
    District: string;
    Ward: string;
    SpecificAddress: string;
    PostalCode: string;
    IsDefault: boolean;
}