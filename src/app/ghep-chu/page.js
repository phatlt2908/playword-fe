import styles from "./page.module.scss";
import Link from "next/link";
import HomeChart from "@/components/contents/home-chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faPeoplePulling,
  faQuestion,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Ghép Chữ online | Nối Từ Vui",
  description:
    "Ghép Chữ online là trò chơi ghép các chữ cái bị xáo trộn thành từ có nghĩa. Tương tự trò chơi Vua Tiếng Việt.",
};

export default async function StickLobbyPage() {
  return (
    <>
      <div className="has-text-centered">
        <h1 className="title is-1">Ghép Chữ</h1>
        <p className="subtitle is-4">
          Trò chơi ghép các chữ cái bị xáo trộn thành từ có nghĩa
        </p>
      </div>
      <div className="is-flex is-flex-direction-column is-align-items-center w-100">
        <div
          className={`columns is-multiline is-mobile is-centered is-vcentered w-100 ${styles.maxContentWidth}`}
        >
          <Link className="column is-narrow" href="/trum-ghep-chu">
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column p-1">
              <FontAwesomeIcon icon={faCrown} size="2x" />
              <h2>Trùm Ghép Chữ</h2>
              <div className="is-size-7">(Chế độ chơi đơn)</div>
            </div>
          </Link>
          <Link className="column" href="/xep-hang?game=2">
            <HomeChart game="2" />
          </Link>
        </div>

        <div className="columns is-mobile mt-5">
          <Link
            className="column"
            href="/online?isSolo=true&game=2"
          >
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faPeoplePulling} size="2x" />
              <h2>Solo 1 vs 1</h2>
            </div>
          </Link>
          <Link className="column" href="/online?game=2">
            <div className="button is-large is-text non-underlined is-flex is-justify-content-space-between is-flex-direction-column">
              <FontAwesomeIcon icon={faUsers} size="2x" />
              <h2>Chơi nhóm</h2>
            </div>
          </Link>
        </div>
      </div>

      <div className="is-flex is-align-items-center">
        <a className="button p-2 hover-underlined" href="/noi-tu-la-gi">
          <FontAwesomeIcon icon={faQuestion} size="sm" />
        </a>
      </div>
    </>
  );
}
