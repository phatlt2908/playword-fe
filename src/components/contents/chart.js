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

export default function RankingChart() {
  const { user } = useUserStore();
  const [list, setList] = useState([]);
  const [maxPoint, setMaxPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wordLinkApi.getRankingChart().then((res) => {
      setList(res.data);
      setMaxPoint(res.data[0].point);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <BrandLoading />
      ) : (
        <div className="w-100">
          {list.map((item, index) => (
            <div key={index} className={`columns is-mobile trans-float-left ${user.code == item.userCode ? "has-background-primary-dark drawing-border" : ""}`}>
              <div className="column is-narrow">
                <figure className="image is-48x48">
                  <Image
                    src={item.avatar}
                    alt="Avatar"
                    width={300}
                    height={300}
                  />
                </figure>
              </div>
              <div className="column">
                <div className="is-flex is-justify-content-space-between">
                  <div>
                    #{index + 1}. {item.userName}
                  </div>
                  <div className="icon-text">
                    <span>{item.point}</span>
                    <span className="icon">
                      <FontAwesomeIcon icon={faStar} size="sm" />
                    </span>
                  </div>
                </div>
                <progress
                  className={`progress is-small ${
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
