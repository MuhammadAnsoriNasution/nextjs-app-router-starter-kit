export interface ProfileTypes {
    email: string,
    id: string,
    img_url: string,
    name: null | string,
    phone_number: string,
}

export interface AuthTypes {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
}