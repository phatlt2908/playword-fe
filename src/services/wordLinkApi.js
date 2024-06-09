import axios from "@/configs/axios";

class wordLinkApi {
  init() {
    return axios.get("/word-link/init");
  }

  answer(answer) {
    return axios.get(`/word-link/answer?word=${answer}`);
  }
}

export default new wordLinkApi();
