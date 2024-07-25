"use client";

import WordLinkMulti from "@/components/contents/multiple-mode";
import BrandLoading from "@/components/utils/brand-loading";

import { useUserStore } from "@/stores/user-store";

export default function MultipleModePage({ params }) {
  const { user } = useUserStore();

  return (
    <>{user.code ? <WordLinkMulti roomId={params.id} /> : <BrandLoading />}</>
  );
}
