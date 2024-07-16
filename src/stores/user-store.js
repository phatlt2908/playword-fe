"use client";

import { createContext, useContext, useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import avatarConst from "@/constants/avatarConst";
import userApi from "@/services/userApi";

export const UserStoreContext = createContext();

export const useUserStore = create(
  persist(
    (set) => ({
      user: {
        id: null,
        code: null,
        name: null,
        avatar: null,
      }, // Initially user object
      setUser: (user) => set({ user }),
      logout: () =>
        set({ user: { id: null, code: null, name: null, avatar: null } }),
      isFirstTime: true,
      setIsFirstTime: (isFirstTime) => set({ isFirstTime }),
    }),
    {
      name: "user-store",
    }
  )
);

export function UserProvider({ children }) {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user-store");
    const existedUser = JSON.parse(userFromStorage);

    if (
      !(
        existedUser &&
        existedUser.state &&
        existedUser.state.user &&
        existedUser.state.user.id
      )
    ) {
      // Generate random code on first-time load
      const randomCode = Math.random().toString(36).substring(2, 10);
      const randomName = Math.random().toString(36).substring(2, 10);
      const randomAvatar =
        avatarConst.AVATAR_LIST[Math.floor(Math.random() * 4)];
      var newUser = {
        code: randomCode,
        name: randomName,
        avatar: randomAvatar,
      };

      // Save to database
      userApi
        .save(newUser)
        .then((response) => {
          newUser["id"] = response.data;
          setUser(newUser);
        })
        .catch((error) => {
          console.error("Failed to save user", error);
        });
    }
  }, []);

  return (
    <UserStoreContext.Provider value={user}>
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUser() {
  const userStore = useContext(UserStoreContext);
  if (!userStore) {
    throw new Error("useUser must be used within UserProvider");
  }
  return userStore;
}
