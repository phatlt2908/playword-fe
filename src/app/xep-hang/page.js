import RankingChart from "@/components/contents/chart";
import Link from "next/link";

export const metadata = {
  title: "Bảng xếp hạng | Nối từ vui",
  description:
    "Bảng xếp hạng nối từ vui, xếp hạng chơi online đơn đạt được điểm cao nhất và xếp hạng tổng điểm theo tháng",
};

export default function ChartPage() {
  return (
    <div className="is-flex is-flex-direction-column is-align-items-center w-100">
      <h1 className="title is-1 mb-5 trans-float-top">Bảng xếp hạng</h1>
      <Link href="/mot-minh" className="button mb-5 trans-float-right">
        Chơi ngay
      </Link>
      <RankingChart />
    </div>
  );
}
