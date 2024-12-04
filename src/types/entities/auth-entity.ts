export type StoreLogin = {
    email: string
    password: string
}

  export type StoreToken = {
    AccessToken: string
    RefreshToken: string
}

export type UserProps = {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    enabled: boolean;
    image: string | null;
}