import axios from "axios";

class Auth {
    async register({ fullname, username, email, password }) {
        try {
            const response = await axios.post("", {
                fullname, username, email, password
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to create account.');
            }
        } catch (error) {
            throw error;
        }
    }
    async login({ username, password }) {
        try {
            const response = await axios.post("", { username, password });
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to login');
            }
        } catch (error) {

        }
    }
}