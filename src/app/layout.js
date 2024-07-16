import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import "@/assets/styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { UserProvider } from "@/stores/user-store";
import BaseHeader from "@/components/layouts/base-header";
import BaseFooter from "@/components/layouts/base-footer";

import { patrick_hand } from "@/utils/fonts";

export const metadata = {
  title: "Nối từ vui - Chơi game nối từ online",
  description:
    "Chơi game nối từ online trên web theo nhóm nhiều người hoặc chơi một mình. Chơi nối từ để có những phút giây giải trí, vừa vui, vừa đau đầu, lại còn nâng cao vốn từ vựng.",
  keywords: [
    "Chơi nối từ online",
    "Chơi game nối từ online",
    "Chơi trò chơi nối từ",
    "Nối từ vui",
    "Noi tu vui",
    "Chơi nối từ web",
    "Nối từ",
    "Nối từ cùng nhau",
    "Nối từ theo nhóm",
  ],
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="vi" data-theme="dark">
        <body className={patrick_hand.variable}>
          <BaseHeader />
          <div className="main">
            <div className="main-center">{children}</div>
          </div>
          <BaseFooter />
        </body>
        <GoogleTagManager gtmId="G-S4VQ7FRKS1" />
        <GoogleAnalytics gaId="G-S4VQ7FRKS1" />
      </html>
    </UserProvider>
  );
}
