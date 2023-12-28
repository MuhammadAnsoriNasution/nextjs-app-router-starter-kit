import { AuthTypes, ProfileTypes } from "@/types/auth";
import { axiosProtect } from "@/utils/axiosInstance";

export async function loginService(data: { email: string, password: string }) {
    return await axiosProtect.post<AuthTypes>(`/login-owner`, data).then((ress) => ress.data)
}

export async function refreshTokenService({ refresh_token, email, token }: { refresh_token: string, email: string, token: string }) {
    return await axiosProtect.post<AuthTypes>("/admin/refresh-token", { refresh_token, email }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((ress) => ress.data)
}

export async function getProfileService() {
    return await axiosProtect.get<{ data: ProfileTypes, message: string }>("/admin/profile").then((ress) => ress.data)
}