"use client";

import { useState, useEffect } from "react";

import {
  faFilter,
  faPlay,
  faQuestion,
  faRotate,
  faSearch,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

import wordLinkApi from "@/services/wordLinkApi";
import stickApi from "@/services/stickApi";
import roomApi from "@/services/roomApi";
import StandardModal from "@/components/contents/standard-modal";
import SpinnerLoading from "@/components/utils/spinner-loading";
import BrandLoading from "@/components/utils/brand-loading";

import swal from "sweetalert2";

import commonConst from "@/constants/commonConst";

const roomNameExamples = [
  "Độc cô cầu bại...",
  "Cần một ván thua",
  "Cần một trận thắng",
  "Lêu Lêu FA 🤪",
  "Nốt ván này thôi...",
  "Không tên",
  "Đừng vào! thua đấy...",
  "Vùng đất cấm",
  "Vùng đất hoang",
  "Cổng thời gian",
  "Nơi ẩn náu",
  "Thiên đường",
  "Địa ngục",
  "Phòng truyền thống",
  "Phòng cổ",
  "Phòng hiện đại",
  "Phòng học",
  "Phòng ngủ",
  "Phòng khách",
  "Hoàng Sa, Trường Sa là của Việt Nam",
  "Phòng chống dịch",
  "Phòng cách ly",
];

const MultiModeLobby = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [isOpenCreateRoomPopup, setIsOpenCreateRoomPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [gameFilter, setGameFilter] = useState(null);
  const [gameCreateMode, setGameCreateMode] = useState(null);

  const { user } = useUserStore();

  useEffect(() => {
    const initGameMode = searchParams.get("game");
    setGameMode(initGameMode);
    setGameFilter(initGameMode);
    setGameCreateMode(initGameMode ? initGameMode : 1);

    const isSolo = searchParams.get("isSolo");
    if (isSolo) {
      solo(initGameMode);
    }
  }, []);

  useEffect(() => {
    search();
  }, [gameFilter]);

  useEffect(() => {
    setRoomName(
      roomNameExamples[Math.floor(Math.random() * roomNameExamples.length)]
    );
  }, [isOpenCreateRoomPopup]);

  const search = () => {
    setIsLoading(true);
    roomApi
      .getRoomList(gameFilter, keyword)
      .then((response) => {
        setRoomList(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const onCreateRoom = () => {
    setIsCreatingRoom(true);
    setIsOpenCreateRoomPopup(false);
    generateRoomAndJoin(gameCreateMode, roomName);
  };

  const onCreateSoloRoom = (gameMode) => {
    setIsCreatingRoom(true);
    setIsOpenCreateRoomPopup(false);
    generateRoomAndJoin(gameMode, commonConst.SOLO_ROOM_NAME);
  };

  const generateRoomAndJoin = (gameMode, name) => {
    if (gameMode == 1) {
      const roomId = "noi-tu-" + Math.random().toString(36).substring(2, 8);
      roomApi
        .createRoom(roomId, name, user.code, 1)
        .then(() => {
          router.push(`/online/${roomId}`);
        })
        .catch((error) => console.log("Can not create a new room ", error));
    } else if (gameMode == 2) {
      const roomId = "khac-nhap-" + Math.random().toString(36).substring(2, 8);
      roomApi
        .createRoom(roomId, name, user.code, 2)
        .then(() => {
          router.push(`/online/${roomId}`);
        })
        .catch((error) => console.log("Can not create a new room ", error));
    }
  };

  const onJoinRoom = (roomId) => {
    router.push(`/online/${roomId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onCreateRoom();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const solo = (gameMode) => {
    roomApi.findRoomSolo(gameMode ? gameMode : 1).then((response) => {
      if (response.data) {
        router.push(`/online/${response.data}`);
      } else {
        onCreateSoloRoom(gameMode ? gameMode : 1);
        swal.fire({
          text: "Đang tìm đối thủ...",
          toast: true,
          position: "top",
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      {isCreatingRoom ? (
        <BrandLoading />
      ) : (
        <>
          <div className="w-100">
            <div className="columns is-vcentered">
              <div className="column has-text-centered">
                <button className="button" onClick={() => solo(gameMode)}>
                  <span>Solo 1 vs 1</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </span>
                </button>
              </div>
            </div>
            <div className="columns">
              <div className="column is-narrow has-text-centered">
                <button
                  className="button is-large"
                  onClick={() => setIsOpenCreateRoomPopup(true)}
                >
                  <span>Tạo phòng</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                  </span>
                </button>
              </div>
              <div className="column">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className="input drawing-border"
                      type="text"
                      placeholder="Nhập mã/tên phòng"
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>
                  <div className="control">
                    <button className="button" onClick={search}>
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="is-flex is-align-items-center is-justify-content-flex-end">
                    <div className="control has-icons-left">
                      <div className="select is-small">
                        <select
                          className="drawing-border"
                          value={gameFilter}
                          onChange={(e) => setGameFilter(e.target.value)}
                        >
                          <option value={null}>Tất cả game</option>
                          <option value={1}>Nối Từ</option>
                          <option value={2}>Khắc Nhập Từ</option>
                        </select>
                      </div>
                      <div className="icon is-small is-left">
                        <FontAwesomeIcon icon={faFilter} size="sm" />
                      </div>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="mt-2">
                      <SpinnerLoading />
                    </div>
                  ) : (
                    <div>
                      {roomList && roomList.length ? (
                        <table className="table is-fullwidth is-narrow is-hoverable">
                          <thead>
                            <tr>
                              <th>Mã</th>
                              <th>Tên</th>
                              <th>Số người</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomList.map((room) => (
                              <tr
                                key={room.id}
                                className="cursor-pointer"
                                onClick={() => onJoinRoom(room.id)}
                              >
                                <td>{room.id}</td>
                                <td>{room.name}</td>
                                <td>{room.userCount}</td>
                                <td>
                                  {room.status == "PREPARING"
                                    ? "Đang chờ"
                                    : "Đang chơi"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>Không tìm thấy phòng</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="is-flex is-align-items-center">
            <a className="button p-2 hover-underlined" href="/noi-tu-la-gi">
              <FontAwesomeIcon icon={faQuestion} size="sm" />
            </a>
          </div>
        </>
      )}
      {isOpenCreateRoomPopup && (
        <StandardModal
          id="room-creation"
          onClose={() => setIsOpenCreateRoomPopup(false)}
        >
          <h1 className="title is-1 has-text-centered mb-2">Tạo phòng</h1>
          <div className="field">
            <div className="control">
              <div className="select">
                <select
                  className="drawing-border"
                  value={gameCreateMode}
                  onChange={(e) => setGameCreateMode(e.target.value)}
                >
                  <option value={1}>Nối Từ</option>
                  <option value={2}>Khắc Nhập Từ</option>
                </select>
              </div>
            </div>
          </div>

          <label className="label mt-4">Tên phòng</label>
          <div className="field has-addons">
            <div className="control has-icons-right is-expanded">
              <input
                className="input is-large"
                type="text"
                placeholder="Tên phòng..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={50}
                autoFocus
              />
              <span
                className="icon is-large is-right cursor-pointer allow-all-pointer-event"
                onClick={() =>
                  setRoomName(
                    roomNameExamples[
                      Math.floor(Math.random() * roomNameExamples.length)
                    ]
                  )
                }
              >
                <FontAwesomeIcon icon={faRotate} size="lg" />
              </span>
            </div>
            <div className="control">
              <button
                className="button is-large drawing-border"
                onClick={onCreateRoom}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              </button>
            </div>
          </div>
        </StandardModal>
      )}
    </>
  );
};

export default MultiModeLobby;
