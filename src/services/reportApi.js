import axios from "@/configs/axios";

class reportApi {
  create(data) {
    return axios.post("/report/create", data);
  }
}

export default new reportApi();
