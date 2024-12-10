export type StoreLogin = {
    email: string
    password: string
}

export type StoreToken = {
    AccessToken: string
    RefreshToken: string
}

export type StoreUser = {
    AccessToken: string
    RefreshToken: string
    UserId: string
}

export type UserProps = {
    Id: string;
    FullName: string;
    DateOfBirth: string;
    Role: string;
    UserName: string;
    NormalizedUserName: string;
    Email: string;
    EmailConfirmed: boolean;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    LockoutEnabled: boolean;
    AccessFailedCount: number;
    SecurityStamp: string;
    
   // password: string;
}