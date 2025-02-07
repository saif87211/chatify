import { axiosInstance } from "../config/axios";
class Auth {
    async register({ fullname, username, email, password }) {
        try {
            const response = await axiosInstance.post("/users/register", {
                fullname, username, email, password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async login({ email, password }) {
        try {
            const response = await axiosInstance.post("/users/login", { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser() {
        try {
            const response = await axiosInstance.post("/users/getuser", {});
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
    async logout() {
        try {
            const response = await axiosInstance.post("/users/logout", {});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async updateProfilePicture(image) {
        try {
            const formdata = new FormData();
            formdata.append("profilephoto", image);
            const response = await axiosInstance.patch("/users/profilephoto", formdata);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const auth = new Auth();

export default auth;