"use client";

import { useState } from "react";
import Image from "next/image";

import { useUserStore } from "@/stores/user-store";

import StandardModal from "@/components/contents/standard-modal";
import avatarConst from "@/constants/avatarConst";
import userApi from "@/services/userApi";

export default function UserInput() {
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const { user, setUser } = useUserStore();

  return (
    <>
      <div className="columns is-mobile w-100">
        <div
          className="column is-narrow cursor-pointer py-2"
          onClick={() => setIsSelectingAvatar(true)}
        >
          <div className="image is-32x32">
            <Image
              src={user.avatar}
              alt="Avatar"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="is-size-7 has-text-centered">Đổi</div>
        </div>
        <input
          className="column input is-large drawing-border"
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          onBlur={() => {
            userApi.save(user).catch((err) => {
              console.error("Failed to save user", err);
            });
          }}
          autoFocus
          maxLength={20}
        />
      </div>

      {isSelectingAvatar && (
        <StandardModal onClose={() => setIsSelectingAvatar(false)}>
          <h3 className="title is-3 has-text-centered mb-4">Chọn avatar</h3>
          <div className="columns is-multiline is-centered is-mobile w-100">
            {avatarConst.AVATAR_LIST.map((avatar, index) => (
              <div
                className="column is-flex is-justify-content-center"
                key={index}
                onClick={() => {
                  setUser({ ...user, avatar });
                  setIsSelectingAvatar(false);
                }}
              >
                <figure className="image is-128x128">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={100}
                    height={100}
                    priority
                  />
                </figure>
              </div>
            ))}
          </div>
        </StandardModal>
      )}
    </>
  );
}
