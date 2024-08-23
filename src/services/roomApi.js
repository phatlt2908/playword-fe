import axios from "@/configs/axios";

class roomApi {
  findRoomGame(id) {
    return axios.get("/room/find-room-game?id=" + id);
  }
}

export default new roomApi();
