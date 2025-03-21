import axios from "node_modules/axios";

type loginProps = {
    accessToken: string;
    refreshToken: string;
};

export async function login(username: string, password: string): Promise<loginProps> {
    try {
        const response = await axios.post('/api/v1/auth/login', {
            username: username,
            password: password
        });
        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };

    } catch (error: unknown) {
        throw error;
    }
}

export async function refresh(){
    try {
        const response = await axios.post('/api/v1/auth/refresh', null)
        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };
    } catch (error: unknown) {
        throw error;
    }
}