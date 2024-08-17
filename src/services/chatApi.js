import axios from "@/configs/axios";

class chatApi {
  getHistoryChatList(largestId) {
    return axios.get(`/chat/list?largestId=${largestId}`);
  }
}

export default new chatApi();
