import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faRankingStar,
  faShare,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <div>
        <h1 className="title is-1">Chơi nối từ online</h1>
      </div>

      <div className="is-flex is-flex-direction-column is-align-items-center">
        <div className="columns">
          <Link className="column" href="/mot-minh">
            <div className="button is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faUser} size="2x" />
              <h2>Một mình</h2>
            </div>
          </Link>
          <Link className="column" href="/nhieu-minh">
            <div className="button is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faUsers} size="2x" />
              <h2>Nhiều mình</h2>
            </div>
          </Link>
        </div>
        <Link className="mt-5" href="/xep-hang">
          <div className="cursor-pointer hover-underlined is-flex is-justify-content-space-between is-flex-direction-column">
            <FontAwesomeIcon icon={faRankingStar} size="2x" />
            <div>Bảng xếp hạng</div>
          </div>
        </Link>
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
