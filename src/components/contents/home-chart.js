"use client";

import { useState } from "react";
import RankingChartLite from "./chart-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

export default function HomeChart() {
  const [isDisplayRanking, setIsDisplayRanking] = useState(true);

  setInterval(() => {
    setIsDisplayRanking(!isDisplayRanking);
  }, 3000);

  return (
    <>
      <div style={{ display: isDisplayRanking ? "block" : "none" }}>
        <RankingChartLite />
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
