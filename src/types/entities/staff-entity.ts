export type StaffEntity = {
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

export type CreateStaff = {
    fullName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    password: string;
    userClaimsRequest: number[];
};

export type UpdateStaff = {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
}
