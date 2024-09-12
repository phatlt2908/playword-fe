"use client";

import styles from "./base-header.module.css";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabelMap = new Map([
  ["mot-minh", "Trùm Nối Từ"],
  ["online", "Cùng Nối Từ"],
  ["noi-tu-la-gi", "Nối từ là gì?"],
  ["xep-hang", "Bảng xếp hạng"],
  ["gop-y", "Góp ý"],
  ["blog", "Blog"],
  ["khac-nhap-tu", "Khắc Nhập Từ"],
  ["trum-khac-nhap-tu", "Trùm Khắc Nhập Từ"],
]);

const BaseHeader = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((x) => x);

  return (
    <div
      className={`${styles.header} columns is-centered is-vcentered is-gapless is-mobile`}
    >
      <div className="column is-narrow is-hidden-mobile">
        <Link className="navbar-item" href="/">
          <figure className="image is-3by2 p-4">
            <Image
              className={styles.logo}
              src="/logo.png"
              alt="Logo-noi-tu-vui"
              width={100}
              height={100}
              priority
            />
          </figure>
        </Link>
      </div>

      <div className="column has-text-centered">
        <nav className="breadcrumb is-inline-block" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link className="icon-text" href="/">
                <span className="icon">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span>Nối Từ Vui</span>
              </Link>
            </li>
            {pathArray.map((path, index) => {
              const href = `/${pathArray.slice(0, index + 1).join("/")}`;
              return (
                <li key={path}>
                  <Link href={href}>{routeLabelMap.get(path) || path}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BaseHeader;
