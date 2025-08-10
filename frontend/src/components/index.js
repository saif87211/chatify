import AuthLayout from "./layouts/AuthLayout";
import Register from "./auth/Register";
import Navbar from "./Navbar";
import Login from "./auth/Login";
import UserChatContainer from "./containers/UserChatContainer";
import NoChatSelected from "./layouts/NoChatSelected";
import SideBar from "./SideBar";
import UserChatHeader from "./UserChatHeader";
import GroupChatHeader from "./GroupChatHeader";
import SideBarSkeletion from "./skeletions/SideBarSkeletion";
import MessageSkeletion from "./skeletions/MessageSkeletion";
import MessageInput from "./MessageInput";
import GroupCreateModal from "./modals/GroupCreateModal";
import ConfirmGroupCreateModal from "./modals/ConfirmGroupCreateModal";
import AddUserInGroupModal from "./modals/AddUserInGroupModal";
import GroupProfileModal from "./modals/GroupProfileModal";
import GroupChatContainer from "./containers/GroupChatContainer";

export {
    AuthLayout, Register, Navbar,
    Login, UserChatContainer, NoChatSelected,
    GroupChatHeader,
    SideBar, UserChatHeader, SideBarSkeletion,
    MessageSkeletion, MessageInput, GroupCreateModal,
    ConfirmGroupCreateModal, GroupChatContainer, GroupProfileModal,
    AddUserInGroupModal
};

export const modalIds = {
    ADD_USER_IN_GROUP: "ADD_USER_IN_GROUP",
    CONFIRM_GROUP_CREATE: "CONFIRM_GROUP_CREATE",
    CREATE_GROUP: "CREATE_GROUP",
    GROUP_PROFILE: "GROUP_PROFILE"
}