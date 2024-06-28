import "@/assets/styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import BaseHeader from "@/components/layouts/base-header";

import { patrick_hand } from "@/utils/fonts";

export const metadata = {
  title: "Nối từ",
  description: "Chơi nối từ theo nhóm nhiều người hoặc chơi một mình. Kho từ vựng phong phú, được cập nhật liên tục. Giao diện dễ sử dụng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={patrick_hand.variable}>
        <BaseHeader />
        <main>
          <div className="main-center">{children}</div>
        </main>
      </body>
    </html>
  );
}
