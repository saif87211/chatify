import { axiosInstance } from "../config/axios";

class Chat {
    async getSideBarUsersAndGroups() {
        try {
            const response = await axiosInstance.get("/api/v1/messages/users-and-groups");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getMessages(id) {
        try {
            const response = await axiosInstance.get(`/api/v1/messages/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async sendMessage(senderId, text, image = null, isSendToGroup = false) {
        try {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("image", image);
            if (isSendToGroup)
                formData.append("groupId", senderId);
            else
                formData.append("receiverId", senderId);
            const response = await axiosInstance.post("/api/v1/messages/send", formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async createGroup(groupname = "", membersIds = []) {
        try {
            const response = await axiosInstance.post("/api/v1/groups/create-group", { groupname, members: membersIds })
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getGroupMessages(groupId) {
        try {
            const response = await axiosInstance.get(`/api/v1/groups/group-messages/${groupId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

const chat = new Chat();

export default chat;