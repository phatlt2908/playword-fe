import RankingChart from "@/components/contents/chart";

export const metadata = {
  title: "Bảng xếp hạng | Chơi nối từ online",
  description:
    "Bảng xếp hạng, xếp hạng chơi đơn đạt được điểm cao nhất và xếp hạng tổng điểm theo tháng",
};

export default function ChartPage() {
  return (
    <div className="is-flex is-flex-direction-column is-align-items-center w-100">
      <h1 className="title is-1 mb-6 trans-float-top">Bảng xếp hạng</h1>
      <RankingChart />
    </div>
  );
}
