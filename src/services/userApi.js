import axios from "@/configs/axios";

class userApi {
  save(data) {
    return axios.post("/user/save", data);
  }
}

export default new userApi();
