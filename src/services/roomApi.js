import axios from "@/configs/axios";

class roomApi {
  createRoom(id, name, userCode, game) {
    return axios.get(`/room/create?id=${id}&name=${name}&userCode=${userCode}&game=${game}`);
  }

  findRoomGame(id) {
    return axios.get("/room/find-room-game?id=" + id);
  }

  findRoomSolo(game) {
    return axios.get(`/room/find-room-solo?game=${game}`);
  }

  getRoomList(game, keyword) {
    return axios.get(`/room/list?game=${game ? game : ""}&keyword=${keyword}`);
  }
}

export default new roomApi();
