"use client";

import { useState, useEffect } from "react";

import { faPlay, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

import wordLinkApi from "@/services/wordLinkApi";
import StandardModal from "@/components/contents/standard-modal";

const roomNameExamples = [
  "Độc cô cầu bại...",
  "Cần một ván thua",
  "Cần một trận thắng",
  "Lêu Lêu FA 🤪",
  "Nốt ván này thôi...",
  "Không tên",
  "Đừng vào! thua đấy...",
  "Phòng này có quái vật",
];

const WordLinkMultiSelection = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [isOpenCreateRoomPopup, setIsOpenCreateRoomPopup] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    setRoomName(
      roomNameExamples[Math.floor(Math.random() * roomNameExamples.length)]
    );
  }, [isOpenCreateRoomPopup]);

  const search = () => {
    wordLinkApi
      .getRoomList(keyword)
      .then((response) => {
        setRoomList(response.data);
      })
      .catch((error) => console.log(error));
  };

  const onCreateRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    wordLinkApi
      .createRoom(roomId, roomName)
      .then(() => {
        router.push(`/noi-tu/nhieu-minh/${roomId}`);
      })
      .catch((error) => console.log("Can not create a new room ", error));
  };

  const onJoinRoom = (roomId) => {
    router.push(`/noi-tu/nhieu-minh/${roomId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsOpenCreateRoomPopup(false);
      onCreateRoom();
    }
  };

  return (
    <>
      <div className="columns">
        <div className="column is-narrow has-text-centered">
          <div
            className="button"
            onClick={() => setIsOpenCreateRoomPopup(true)}
          >
            Tạo phòng
          </div>
        </div>
        <div className="column">
          <div className="field has-addons">
            <div className="control">
              <input
                className="input drawing-border"
                type="text"
                placeholder="Nhập mã/tên phòng"
                onChange={(e) => setKeyword(e.target.value)}
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

          {roomList && roomList.length ? (
            <table className="table is-fullwidth is-narrow is-hoverable">
              <thead>
                <tr>
                  <th>Mã phòng</th>
                  <th>Tên phòng</th>
                  <th>Người chơi</th>
                </tr>
              </thead>
              <tbody>
                {roomList.map((room) => (
                  <tr
                    key={room.id}
                    className="cursor-pointer"
                    onClick={() => onJoinRoom(room.id)}
                  >
                    <th>{room.id}</th>
                    <th>{room.name}</th>
                    <th>{room.userCount}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không tìm thấy phòng</p>
          )}
        </div>
      </div>
      {isOpenCreateRoomPopup && (
        <StandardModal
          id="room-creation"
          onClose={() => setIsOpenCreateRoomPopup(false)}
        >
          <label className="label">Tên phòng</label>
          <div className="field has-addons">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Tên phòng..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="control">
              <button className="button drawing-border" onClick={onCreateRoom}>
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

export default WordLinkMultiSelection;
