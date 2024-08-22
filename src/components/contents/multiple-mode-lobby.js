"use client";

import { useState, useEffect } from "react";

import {
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
  "Phòng này có quái vật",
  "Không ai thèm vào",
  "Vùng đất cấm",
  "Vùng đất hoang",
  "Cổng thời gian",
  "Nơi ẩn náu",
  "Góc thiền định",
  "Thiên đường",
  "Địa ngục",
  "Cửa hàng bí mật",
  "Phòng truyền thống",
  "Phòng cổ",
  "Phòng hiện đại",
  "Phòng học",
  "Phòng ngủ",
  "Phòng khách",
];

const WordLinkMultiLobby = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [isOpenCreateRoomPopup, setIsOpenCreateRoomPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const { user } = useUserStore();

  useEffect(() => {
    const isSolo = searchParams.get("isSolo");
    if (isSolo) {
      solo();
    } else {
      search();
    }
  }, []);

  useEffect(() => {
    setRoomName(
      roomNameExamples[Math.floor(Math.random() * roomNameExamples.length)]
    );
  }, [isOpenCreateRoomPopup]);

  const search = () => {
    setIsLoading(true);
    wordLinkApi
      .getRoomList(keyword)
      .then((response) => {
        setRoomList(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const onCreateRoom = () => {
    setIsCreatingRoom(true);
    setIsOpenCreateRoomPopup(false);
    const roomId = Math.random().toString(36).substring(2, 8);
    wordLinkApi
      .createRoom(roomId, roomName, user.code)
      .then(() => {
        router.push(`/nhieu-minh/${roomId}`);
      })
      .catch((error) => console.log("Can not create a new room ", error));
  };

  const onCreateSoloRoom = () => {
    setIsCreatingRoom(true);
    setIsOpenCreateRoomPopup(false);
    const roomId = Math.random().toString(36).substring(2, 8);
    wordLinkApi
      .createRoom(roomId, commonConst.SOLO_ROOM_NAME, user.code)
      .then(() => {
        router.push(`/nhieu-minh/${roomId}`);
      })
      .catch((error) => console.log("Can not create a new solo room ", error));
  };

  const onJoinRoom = (roomId) => {
    router.push(`/nhieu-minh/${roomId}`);
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

  const solo = () => {
    wordLinkApi.findRoom().then((response) => {
      if (response.data) {
        router.push(`/nhieu-minh/${response.data}`);
      } else {
        onCreateSoloRoom();
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
          <div>
            <h1 className="title is-1">Góc Đồng Nối</h1>
            <p className="subtitle is-6">
              Xin chào các &quot;Đồng Nối&quot;! Đây là chế độ chơi nối từ cùng nhau, chơi
              solo theo cặp hoặc theo nhóm nhiều người
            </p>
          </div>

          <div className="w-100">
            <div className="w-100 columns is-vcentered">
              <div className="column has-text-centered">
                <button className="button" onClick={solo}>
                  <span>Solo 1 vs 1</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </span>
                </button>
              </div>
            </div>
            <div className="columns w-100">
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
          <h1 className="title is-1 has-text-centered">Tạo phòng</h1>
          <label className="label">Tên phòng</label>
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

export default WordLinkMultiLobby;
