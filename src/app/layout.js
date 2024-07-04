import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import "@/assets/styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import BaseHeader from "@/components/layouts/base-header";

import { patrick_hand } from "@/utils/fonts";

export const metadata = {
  title: "Chơi nối từ online",
  description:
    "Chơi nối từ không? Nối từ theo nhóm nhiều người hoặc chơi một mình. Chơi nối từ vừa giải trí, vừa đau đầu, lại còn nâng cao vốn từ vựng. Kho từ vựng phong phú, được cập nhật liên tục, giao diện dễ sử dụng",
  keywords: ["Chơi nối từ không", "Nối từ", "Nối từ cùng nhau", "Nối từ theo nhóm"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-theme="dark">
      <body className={patrick_hand.variable}>
        <BaseHeader />
        <div className="main">
          <div className="main-center">{children}</div>
        </div>
      </body>
      <GoogleTagManager gtmId="G-S4VQ7FRKS1" />
      <GoogleAnalytics gaId="G-S4VQ7FRKS1" />
    </html>
  );
}
