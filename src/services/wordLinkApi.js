import axios from "@/configs/axios";

class wordLinkApi {
  init() {
    return axios.get("/word-link/init");
  }

  answer(answer) {
    return axios.get(`/word-link/answer?word=${answer}`);
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
