import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

const wordLinkLogo = "/word-link-logo.jpg";

export default function Home() {
  return (
    <>
      <div className="columns is-multiline is-centered is-mobile w-100">
        <Link
          href="/noi-tu"
          id="word-link"
          className="cursor-pointer column is-one-quarter-widescreen is-one-third-desktop is-one-third-tablet is-half-mobile"
        >
          <div className="card">
            <div className="card-image">
              <figure className="image is-1by1">
                <Image
                  src={wordLinkLogo}
                  alt="Noi tu"
                  width={500}
                  height={500}
                  priority
                />
              </figure>
            </div>
            <div className="card-content has-text-centered title is-size-6 p-3">
              Nối từ
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
