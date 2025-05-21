import { Axis3DIcon } from "lucide-react";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
   messages: [],
   users: [],
   selectedUser: null,
   isUserLoading: false,
   isMessagesLoading: false,

   getUsers: async () => {
      set({ isUserLoading: true });
      try {
         const { data } = await axiosInstance.get("/user/users");
         set({ users: data.users });
      } catch (err) {
         toast.error(err.response.data.message);
      } finally {
         set({ isUserLoading: false });
      }
   },

   getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
         const { data } = await axiosInstance.get(`/user/${userId}`);
         if (data.success) {
            set({ messages: data.messages });
         }
      } catch (err) {
         toast.error(err.response.data.message);
      } finally {
         set({ isMessagesLoading: false });
      }
   },

   sendMessage: async (formData) => {
      const { selectedUser, messages } = get();
      try {
         const { data } = await axiosInstance.post(
            `/user/send/${selectedUser._id}`,
            formData
         );
         set({ messages: [...messages, data.messages] });
      } catch (err) {
         toast.error(err.response.data.message);
      }
   },

   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;

      socket.on("newMessage", (newMessage) => {
         if (newMessage.senderId !== selectedUser._id) return;

         set({
            messages: [...get().messages, newMessage],
         });
      });
   },

   unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
   },

   setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default useChatStore;
