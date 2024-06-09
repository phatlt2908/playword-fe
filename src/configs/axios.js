import axios from "axios";
import swal from "sweetalert2";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 500 || error.response.status === 502) {
      swal.fire({
        title: "Ops! Lỗi rồi :(",
        text: "Máy chủ đang được nâng cấp, vui lòng thử lại sau nhé! 😣",
        icon: "error",
        confirmButtonText: "Đóng",
      });
    }
    return Promise.reject(error);
  }
);

export default api;
