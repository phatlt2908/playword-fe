import axios from "@/configs/axios";

class stickApi {
  getWord() {
    return axios.get("/stick/get-word");
  }

  answer(answer) {
    return axios.get("/stick/answer?answer=" + answer);
  }

  getResult(point, userCode) {
    return axios.get(`/stick/result?point=${point}&userCode=${userCode}`);
  }

  getRankingChart(top) {
    return axios.get(`/stick/ranking-chart?top=${top}`);
  }

  getCurrentUserRanking(userCode) {
    return axios.get(`/stick/user-ranking?userCode=${userCode}`);
  }

  createRoom(id, name, userCode) {
    return axios.get(`/stick/create-room?id=${id}&name=${name}&userCode=${userCode}`);
  }
}

export default new stickApi();
