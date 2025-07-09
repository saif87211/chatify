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
    async sendMessage(senderId, text, image = null) {
        try {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("image", image);
            const response = await axiosInstance.post(`/api/v1/messages/send/${senderId}`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async createGroup(groupname = "", membersIds = [], image = null) {
        try {
            const formData = new FormData();
            formData.append("groupname", groupname);
            membersIds.forEach((id) => formData.append("members[]", id));
            formData.append("image", image);
            console.log(formData);
            const response = await axiosInstance.post("/api/v1/groups/create-group", formData)
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
    async sendMessageToGroup(groupId, text, image = null) {
        try {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("image", image);
            const response = await axiosInstance.post(`/api/v1/groups/send/${groupId}`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getGroupInfo(groupId) {
        try {
            const response = await axiosInstance.get(`/api/v1/groups/get-group/${groupId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async removeUserFromGroup(groupId, userIdToRemove) {
        try {
            const response = await axiosInstance.post(`/api/v1/groups/remove-user`, { groupId, userIdToRemove });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async exitGroup(groupId) {
        try {
            const response = await axiosInstance.post(`/api/v1/groups/left-group/${groupId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async updateGroupName(groupId, groupName) {
        try {
            const response = await axiosInstance.patch(`/api/v1/groups/update-groupname`, { groupId, groupName });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async updateGroupProfilePicture(groupId, image) {
        try {
            const formdata = new FormData();
            formdata.append("profilephoto", image);
            const response = await axiosInstance.patch(`/api/v1/groups/update-group-profilepic/${groupId}`, formdata);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async addUserInGroup(groupId, emailOfUserToAdd) {
        try {
            const response = await axiosInstance.post(`/api/v1/groups/add-user`, { groupId, emailOfUserToAdd });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async AddMembersInGroup(groupId, membersIds) {
        try {
            const response = await axiosInstance.post(`/api/v1/groups/add-members`, { membersIds, groupId });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const chat = new Chat();

export default chat;