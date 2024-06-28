import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <div className="columns">
      <Link className="column" href="/mot-minh">
        <div className="button is-flex is-justify-content-space-between is-flex-direction-column">
          <FontAwesomeIcon icon={faUser} size="2x" />
          <span>Một mình</span>
        </div>
      </Link>
      <Link className="column" href="/nhieu-minh">
      <div className="button is-flex is-justify-content-space-between is-flex-direction-column">
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <span>Nhiều mình</span>
        </div>
      </Link>
    </div>
  );
};

export default Home;
