import { Inter } from "next/font/google";
import "@/assets/styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import BaseHeader from "@/components/layouts/base-header";
import BaseFooter from "@/components/layouts/base-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
