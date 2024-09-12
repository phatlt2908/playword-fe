import MultiModeLobby from "@/components/contents/multiple-mode-lobby";
import { Suspense } from "react";

export const metadata = {
  title: "Chơi game nối từ solo - Nối từ online nhóm nhiều người | Nối Từ Vui",
  description:
    "Chơi game nối từ online cùng nhau, chơi ghép chữ cùng nhau, chơi solo 1 vs 1 hoặc theo nhóm nhiều người. Đánh bại các đối thủ và trở thành người chơi còn lại cuối cùng để giành chiến thắng",
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
    <>
      <div className="has-text-centered">
        <h1 className="title is-1">Cùng Nối Từ</h1>
        <p className="subtitle is-6">
          Đây là chế độ chơi nối từ, ghép chữ cùng nhau, chơi solo 1 vs 1 hoặc
          chơi online theo nhóm nhiều người
        </p>
      </div>
      <Suspense>
        <MultiModeLobby />
      </Suspense>
    </>
  );
}
