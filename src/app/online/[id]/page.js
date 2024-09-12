"use client";

import { useEffect, useState } from "react";

import roomApi from "@/services/roomApi";

import WordLinkMulti from "@/components/contents/word-link-multiple-mode";
import BrandLoading from "@/components/utils/brand-loading";

import { useUserStore } from "@/stores/user-store";
import StickMulti from "@/components/contents/stick-multiple-mode";

export default function MultipleModePage({ params }) {
  const { user } = useUserStore();
  const [game, setGame] = useState(null);

  useEffect(() => {
    roomApi.findRoomGame(params.id).then((res) => {
      setGame(res.data);
    });
  }, []);

  return (
    <>
      {user.code && game ? (
        game == 1 ? (
          <WordLinkMulti roomId={params.id} />
        ) : (
          <StickMulti roomId={params.id} />
        )
      ) : (
        <BrandLoading />
      )}
    </>
  );
}
