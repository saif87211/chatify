import { axiosInstance } from "../config/axios";

class Chat {
    async getSideBarUsers() {
        try {
            const response = await axiosInstance.get("/messages/users");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getMessages(id) {
        try {
            const response = await axiosInstance.get(`/messages/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async sendMessage(id) {
        try {
            const response = await axiosInstance.post(`/messages/send/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const chat = new Chat();

export default chat;