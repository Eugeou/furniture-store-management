export type CustomerEntity = {
    Id: string;
    FullName: string;
    Email: string;
    DateOfBirth: string;
    PhoneNumber: string;
    ImageSource: string;
    Role: string;
    IsDeleted: boolean;
    IsLocked: boolean;
};

export type CreateCustomer = {
    fullName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    password: string;
    userClaimsRequest: number[];
};
