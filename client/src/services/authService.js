import api from "@/lib/api";


const register = async ({
    firstName,
    lastName,
    email,
    phone,
    password,
}) => {

    const response =
        await api.post(
            "/auth/register",
            {
                firstName,
                lastName,
                email,
                phone,
                password,
            }
        );


    return response.data;

};


const login = async ({
    email,
    password,
}) => {

    const response =
        await api.post(
            "/auth/login",
            {
                email,
                password,
            }
        );


    return response.data;

};


const logout = async () => {

    const response =
        await api.post(
            "/auth/logout"
        );


    return response.data;

};


const getCurrentUser =
    async () => {

    const response =
        await api.get(
            "/auth/me"
        );


    return response.data;

};


const authService = {

    register,

    login,

    logout,

    getCurrentUser,

};


export default authService;