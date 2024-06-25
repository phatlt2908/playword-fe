import "@/assets/styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import BaseHeader from "@/components/layouts/base-header";
import BaseFooter from "@/components/layouts/base-footer";

import { patrick_hand } from "@/utils/fonts";

export const metadata = {
  title: "Chơi chữ",
  description: "Chơi chữ - vì nét đẹp của Tiếng Việt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={patrick_hand.variable}>
        <main>
          <BaseHeader />
          <div className="main-center">
            {children}
          </div>
          <BaseFooter />
        </main>
      </body>
    </html>
  );
}
