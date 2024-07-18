import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPeoplePulling,
  faRankingStar,
  faShare,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <div>
        <h1 className="title is-1">Nối từ vui</h1>
      </div>

      <div className="is-flex is-flex-direction-column is-align-items-center">
        <div className="half-transparency-background p-5 drawing-border">
          <div className="columns is-mobile is-vcentered">
            <Link className="column" href="/mot-minh">
              <div className="button is-text is-flex is-justify-content-space-between is-flex-direction-column">
                <FontAwesomeIcon icon={faUser} size="2x" />
                <h2>Nối đơn</h2>
              </div>
            </Link>
            <Link className="column" href="/xep-hang">
              <div className="button is-text is-justify-content-space-between is-flex-direction-column">
                <FontAwesomeIcon icon={faRankingStar} />
                <div className="is-size-6">Bảng xếp hạng</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="columns is-mobile mt-5">
          <Link className="column" href="/nhieu-minh?isSolo=true">
            <div className="button is-text is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faPeoplePulling} size="2x" />
              <h2>Solo 1 vs 1</h2>
            </div>
          </Link>
          <Link className="column" href="/nhieu-minh">
            <div className="button is-text is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faUsers} size="2x" />
              <h2>Nối nhóm</h2>
            </div>
          </Link>
        </div>
      </div>

      <div className="is-flex is-flex-direction-column is-align-items-center">
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
