import axios from "@/configs/axios";

class blogApi {
  blogList() {
    return axios.get("/blog/list");
  }

  blogDetail(code) {
    return axios.get("/blog/detail?code=" + code);
  }
}

export default new blogApi();
