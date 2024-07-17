import axios from "@/configs/axios";

class feedbackApi {
  send(data) {
    return axios.post("/feedback/send", data);
  }
}

export default new feedbackApi();
