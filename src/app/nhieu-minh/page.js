import WordLinkMultiLobby from "@/components/contents/multiple-mode-lobby";
import { Suspense } from "react";

export const metadata = {
  title: "Chơi game nối từ solo - Nối từ nhóm | Nối từ vui",
  description:
    "Chơi nối từ nhóm online cùng nhau, chơi solo theo cặp hoặc theo nhóm nhiều người. Đánh bại các đối thủ và trở thành người chơi còn lại cuối cùng để giành chiến thắng",
  keywords: [
    "Chơi nối từ online",
    "Chơi game nối từ online",
    "Chơi trò chơi nối từ",
    "Chơi nối từ web",
    "Chơi game nối từ online cùng nhau",
    "Chơi game nối từ solo",
  ],
};

export default function MultipleModeLobbyPage() {
  return (
    <Suspense>
      <WordLinkMultiLobby />
    </Suspense>
  );
}
