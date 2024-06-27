"use client";

import styles from "./base-header.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabelMap = new Map([
  ["noi-tu", "Nối từ"],
  ["mot-minh", "Một mình"],
  ["nhieu-minh", "Nhiều mình"],
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
          Chơi chữ
        </Link>
      </div>

      <div className="column has-text-centered">
        <nav className="breadcrumb is-inline-block" aria-label="breadcrumbs">
          <ul>
            <li className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faHouse} />
              </span>
              <Link href="/">Chơi chữ</Link>
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
