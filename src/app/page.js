import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlog,
  faBook,
  faCrown,
  faPeoplePulling,
  faShare,
  faShuffle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./page.module.scss";
import HomeChart from "@/components/contents/home-chart";

const Home = () => {
  return (
    <>
      <div>
        <h1 className="title is-1">Nối từ vui</h1>
      </div>

      <div className="is-flex is-flex-direction-column is-align-items-center w-100">
        <div
          className={`columns is-multiline is-mobile is-vcentered w-100 ${styles.maxContentWidth}`}
        >
          <Link className="column is-narrow" href="/mot-minh">
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column p-1">
              <FontAwesomeIcon icon={faCrown} size="2x" />
              <h2>Trùm nối từ</h2>
              <div className="is-size-7">(Chế độ chơi đơn)</div>
            </div>
          </Link>
          <Link className="column" href="/xep-hang?game=1">
            <HomeChart game="1" />
          </Link>
        </div>

        <div className="columns is-mobile">
          <Link className="column" href="/nhieu-minh?isSolo=true">
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faPeoplePulling} size="2x" />
              <h2>Solo 1 vs 1</h2>
            </div>
          </Link>
          <Link className="column" href="/nhieu-minh">
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faUsers} size="2x" />
              <h2>Nối nhóm</h2>
            </div>
          </Link>
        </div>

        <hr
          style={{ width: "100%", backgroundColor: "white", margin: "0px 0px" }}
        />
      </div>

      <div className="columns is-mobile">
        <Link className="column" href="/khac-nhap-tu">
          <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column">
            <span
              className="tag is-danger"
              style={{ position: "absolute", left: "10px" }}
            >
              Mới
            </span>
            <FontAwesomeIcon icon={faShuffle} size="2x" />
            <h2>Khắc Nhập Từ</h2>
          </div>
        </Link>
      </div>

      <div className="is-flex is-flex-direction-column is-align-items-center">
        <a className="icon-text p-2" href="/blog">
          <span>Blog</span>
          <span className="icon">
            <FontAwesomeIcon icon={faBlog} />
          </span>
        </a>
        <a className="icon-text p-2" href="/noi-tu-la-gi">
          <span>Hướng dẫn</span>
          <span className="icon">
            <FontAwesomeIcon icon={faBook} />
          </span>
        </a>
        <a
          className="icon-text p-2"
          target="_blank"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fnoitu.fun%2F&amp;src=sdkpreparse"
        >
          <span>Chia sẻ</span>
          <span className="icon">
            <FontAwesomeIcon icon={faShare} />
          </span>
        </a>
      </div>
    </>
  );
};

export default Home;
