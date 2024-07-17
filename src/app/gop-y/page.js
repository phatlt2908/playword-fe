import Feedback from "@/components/contents/feedback";

export const metadata = {
  title: "Góp ý và phản hồi | Nối từ vui",
  description:
    "Chúng tôi trân trọng những góp ý và phản hồi của các bạn, đó là những cơ hội để Nối Từ Vui và cộng đồng ngày càng hoàn thiện hơn nữa.",
};

export default function FeedbackPage() {
  return (
    <div className="is-flex is-flex-direction-column is-align-items-center w-100">
      <h1 className="title is-1 mb-6 trans-float-top">Góp ý và phản hồi</h1>
      <p>
        Trân trọng cảm ơn các bạn! những góp ý và phản hồi của các bạn là cơ hội
        để Nối Từ Vui ngày càng hoàn thiện hơn 🥰
      </p>
      <Feedback />
    </div>
  );
}
