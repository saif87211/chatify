import { axiosInstance } from "../config/axios";
class Auth {
    async register({ fullname, username, email, password }) {
        try {
            const response = await axiosInstance.post("/users/register", {
                fullname, username, email, password
            });
            console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async login({ username, password }) {
        try {
            const response = await axiosInstance.post("/users/login", { username, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser() {
        try {
            const response = await axiosInstance.post("/users/getuser", {});
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
}

const auth = new Auth();

export default auth;