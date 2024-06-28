import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <div>
        <h1 className="title is-1">Cùng nối từ nhé!</h1>
        <p className="subtitle is-3 has-text-centered">Chọn chế độ chơi...</p>
      </div>
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
      <a
        className="icon-text"
        target="_blank"
        href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fnoitu.fun%2F&amp;src=sdkpreparse"
      >
        <span>Chia sẻ</span>
        <span className="icon">
          <FontAwesomeIcon icon={faShare} />
        </span>
      </a>
    </>
  );
};

export default Home;
