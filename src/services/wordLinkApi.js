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

  createRoom(id, name, userCode) {
    return axios.get(`/multi-word-link/create-room?id=${id}&name=${name}&userCode=${userCode}`);
  }

  findRoom() {
    return axios.get(`/multi-word-link/find-room`);
  }

  getResult(point, userCode) {
    return axios.get(`/word-link/result?point=${point}&userCode=${userCode}`);
  }

  getRankingChart(top) {
    return axios.get(`/word-link/ranking-chart?top=${top}`);
  }

  getCurrentUserRanking(userCode) {
    return axios.get(`/word-link/user-ranking?userCode=${userCode}`);
  }
}

export default new wordLinkApi();
