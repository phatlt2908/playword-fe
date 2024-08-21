"use client";

import { useEffect, useState } from "react";
import RankingChartLite from "./chart-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

export default function HomeChart({ game }) {
  const [isDisplayRanking, setIsDisplayRanking] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setIsDisplayRanking((isDisplayRanking) => !isDisplayRanking);
    }, 3000);
  }, []);

  return (
    <>
      <div style={{ display: isDisplayRanking ? "block" : "none" }}>
        <RankingChartLite game={game} />
      </div>

      {!isDisplayRanking && (
        <div className="button trans-float-right is-text non-underlined is-justify-content-space-between is-flex-direction-column w-100 near-transparency-background">
          <FontAwesomeIcon icon={faRankingStar} />
          <div className="is-size-6">Bảng xếp hạng</div>
        </div>
      )}
    </>
  );
}
