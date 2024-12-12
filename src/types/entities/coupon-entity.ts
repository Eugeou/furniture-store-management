export interface Coupon {
    //name: string;
    Description?: string;
    Quantity?: number;
    StartDate: string;
    EndDate: string;
    DiscountValue: number;
    MinOrderValue: number;
    ECouponType: string;
    Image?: File;
}

export interface ExistedCoupon {
    Id: string;
    Description?: string;
    Quantity?: number;
    StartDate: string;
    EndDate: string;
    DiscountValue: number;
    MinOrderValue: number;
    ECouponType: string;
    ImageSource: string;
}