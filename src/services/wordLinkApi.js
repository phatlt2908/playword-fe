import axios from "@/configs/axios";

class wordLinkApi {
  init() {
    return axios.get("/word-link/init");
  }

  answer(data) {
    return axios.post("/word-link/answer", data);
  }

  getRoomList(keyword) {
    return axios.get(`/multi-word-link/room-list?keyword=${keyword}`);
  }

  createRoom(id, name) {
    return axios.get(`/multi-word-link/create-room?id=${id}&name=${name}`);
  }

  getResult(point) {
    return axios.get(`/word-link/result?point=${point}`);
  }
}

export default new wordLinkApi();
