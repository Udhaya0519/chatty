import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

const useAuthStore = create((set, get) => ({
   user: null,
   isCheckingAuth: true,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,
   onlineUsers: [],
   socket: null,

   checkAuth: async () => {
      try {
         const { data } = await axiosInstance.get("/auth/check-auth");
         set({ user: data.user });

         get().connectSocket();
      } catch (err) {
         set({ user: null });
      } finally {
         set({ isCheckingAuth: false });
      }
   },
   signup: async (formData) => {
      set({ isSigningUp: true });
      try {
         const { data } = await axiosInstance.post("/auth/signup", formData);

         if (data.success) {
            set({ user: data.user });
            toast.success(data.message);
            get().connectSocket();
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         console.error("Error signing up", err);
         const msg =
            err.response?.data?.message ||
            "Something went wrong, please try again";
         toast.error(msg);
      } finally {
         set({ isSigningUp: false });
      }
   },
   logout: async () => {
      try {
         const { data } = await axiosInstance.post("/auth/logout");
         if (data.success) {
            set({ user: null });
            toast.success(data.message);

            get().disconnectSocket();
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         console.error("Error logging in", err);
         const msg =
            err.response?.data?.message ||
            "Something went wrong, please try again";
         toast.error(msg);
      }
   },
   login: async (formData) => {
      set({ isLoggingIn: true });
      try {
         const { data } = await axiosInstance.post("/auth/login", formData);

         if (data.success) {
            set({ user: data.user });
            toast.success(data.message);
            get().connectSocket();
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         console.error("Error logging in", err);
         const msg =
            err.response?.data?.message ||
            "Something went wrong, please try again";
         toast.error(msg);
      } finally {
         set({ isLoggingIn: false });
      }
   },
   updateProfile: async (image) => {
      set({ isUpdatingProfile: true });
      try {
         const { data } = await axiosInstance.put(
            "/user/update-profile",
            image
         );
         if (data.success) {
            set({ user: data.user });
            toast.success(data.message);
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         console.error("Error updating profile pic", err);
         const msg =
            err.response?.data?.message ||
            "Something went wrong, please try again";
         toast.error(msg);
      } finally {
         set({ isUpdatingProfile: false });
      }
   },

   connectSocket: () => {
      const { user } = get();
      if (!user || get().socket?.connected) {
         return;
      }
      const socket = io(BASE_URL, {
         query: {
            userId: user._id,
         },
      });
      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
         set({onlineUsers: userIds})
      })
   },
   disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
   },
}));

export default useAuthStore;
