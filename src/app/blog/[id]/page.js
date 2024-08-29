import Image from "next/image";
import blogApi from "@/services/blogApi";
import Link from "next/link";
import { unstable_cache } from "next/cache";

export async function generateMetadata({ params }) {
  const res = await blogApi.blogDetail(params.id);
  const data = res.data;

  return {
    title: data.title,
    description: data.description,
  };
}

const getBlogDetail = unstable_cache(
  async (id) => {
    const res = await blogApi.blogDetail(id);
    const data = res.data;
    return data;
  },
  ["blog"],
  { revalidate: 60, tags: ["blog"] }
);

export default async function BlogDetailPage({ params }) {
  const data = await getBlogDetail(params.id);
  const content = { __html: data.content };

  return (
    <>
      <div className="content">
        <h1>{data.title}</h1>
        <div dangerouslySetInnerHTML={content}></div>
      </div>
      <Link href="/" className="button mt-4">
        Chơi nối từ online
      </Link>
    </>
  );
}
