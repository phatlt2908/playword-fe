"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wordLinkApi from "@/services/wordLinkApi";

import { useUserStore } from "@/stores/user-store";

import BrandLoading from "../utils/brand-loading";

const progressBarColorList = [
  "",
  "is-link",
  "is-primary",
  "is-danger",
  "is-warning",
  "is-success",
  "is-info",
];

export default function RankingChartLite() {
  const { user } = useUserStore();
  const [list, setList] = useState([]);
  const [maxPoint, setMaxPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wordLinkApi.getRankingChart(3).then((res) => {
      setList(res.data);
      setMaxPoint(res.data[0].point);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <center>
          <BrandLoading />
        </center>
      ) : (
        <div className="w-100">
          {list.map((item, index) => (
            <div
              key={index}
              className={`columns is-gapless is-mobile trans-float-left mb-1 ${
                user.code == item.userCode
                  ? "has-background-primary-dark drawing-border"
                  : ""
              }`}
            >
              <div className="column is-narrow mr-1">
                <figure className="image is-32x32">
                  <Image
                    src={item.avatar}
                    alt="avatar-noi-tu"
                    width={32}
                    height={32}
                  />
                </figure>
              </div>
              <div className="column is-size-6">
                <div className="is-flex is-justify-content-space-between">
                  <div>
                    #{item.rank}. {item.userName}
                  </div>
                  <div className="icon-text">
                    <span>{item.point}</span>
                    <span className="icon">
                      <FontAwesomeIcon icon={faStar} size="xs" />
                    </span>
                  </div>
                </div>
                <progress
                  className={`progress is-tiny ${
                    progressBarColorList[
                      Math.floor(Math.random() * progressBarColorList.length)
                    ]
                  }`}
                  value={item.point}
                  max={maxPoint}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
