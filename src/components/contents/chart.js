"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wordLinkApi from "@/services/wordLinkApi";
import stickApi from "@/services/stickApi";

import { useUserStore } from "@/stores/user-store";

import BrandLoading from "../utils/brand-loading";
import Link from "next/link";

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
  const [currentRank, setCurrentRank] = useState();
  const [maxPoint, setMaxPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const game = searchParams.get("game");
    fetchData(game);
  }, []);

  useEffect(() => {
    const game = searchParams.get("game");
    fetchData(game);
  }, [searchParams]);

  const fetchData = async (game) => {
    if (game == 1) {
      wordLinkApi.getRankingChart(20).then((res) => {
        setList(res.data);
        setMaxPoint(res.data[0].point);

        const userFromStorage = localStorage.getItem("user-store");
        const existedUser = JSON.parse(userFromStorage);
        const userCode = existedUser?.state?.user?.code;

        if (userCode && !res.data.some((item) => item.userCode == userCode)) {
          wordLinkApi.getCurrentUserRanking(userCode).then((res) => {
            setCurrentRank(res.data);
          });
        }

        setIsLoading(false);
      });
    } else if (game == 2) {
      stickApi.getRankingChart(20).then((res) => {
        setList(res.data);
        setMaxPoint(res.data[0].point);

        const userFromStorage = localStorage.getItem("user-store");
        const existedUser = JSON.parse(userFromStorage);
        const userCode = existedUser?.state?.user?.code;

        if (userCode && !res.data.some((item) => item.userCode == userCode)) {
          stickApi.getCurrentUserRanking(userCode).then((res) => {
            setCurrentRank(res.data);
          });
        }

        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <div className="tabs is-toggle is-medium mb-5">
        <ul>
          <li className={searchParams.get("game") == 1 && "is-active"}>
            <Link href="/xep-hang?game=1" className="drawing-border">
              Nối Từ
            </Link>
          </li>
          <li className={searchParams.get("game") == 2 && "is-active"}>
            <Link href="/xep-hang?game=2" className="drawing-border">
              Khắc Nhập Từ
            </Link>
          </li>
        </ul>
      </div>

      {isLoading ? (
        <BrandLoading />
      ) : (
        <div className="w-100">
          {list.map((item, index) => (
            <div
              key={index}
              className={`columns is-mobile trans-float-left ${
                user.code == item.userCode
                  ? "has-background-primary-dark drawing-border"
                  : ""
              }`}
            >
              <div className="column is-narrow">
                <figure className="image is-48x48">
                  <Image
                    src={item.avatar}
                    alt="avatar-noi-tu"
                    width={300}
                    height={300}
                  />
                </figure>
              </div>
              <div className="column">
                <div className="is-flex is-justify-content-space-between">
                  <div>
                    #{item.rank}. {item.userName}
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

          {currentRank && (
            <>
              <div className="mt-4 mb-6">...</div>
              <div className="columns is-mobile trans-float-left has-background-primary-dark drawing-border">
                <div className="column is-narrow">
                  <figure className="image is-48x48">
                    <Image
                      src={currentRank.avatar}
                      alt="avatar-noi-tu"
                      width={300}
                      height={300}
                    />
                  </figure>
                </div>
                <div className="column">
                  <div className="is-flex is-justify-content-space-between">
                    <div>
                      #{currentRank.rank}. {currentRank.userName}
                    </div>
                    <div className="icon-text">
                      <span>{currentRank.point}</span>
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
                    value={currentRank.point}
                    max={maxPoint}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
