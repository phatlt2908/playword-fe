import Image from "next/image";

import blogApi from "@/services/blogApi";
import styles from "./page.module.scss";
import Link from "next/link";

export const metadata = {
  title: "Blog | Nối từ vui",
  description: "Nơi chia sẻ những tip để chơi nối từ vui và hơn thế nữa",
};

// This function can be named anything
async function getBlogList() {
  const res = await blogApi.blogList();
  const blogList = res.data;

  return blogList;
}

export default async function BlogListPage() {
  const blogList = await getBlogList();

  return (
    <>
      <div>
        <h1 className="title is-1">Blog Nối Từ Vui</h1>
        <div className="subtitle is-6">
          Nơi chia sẻ những tip để chơi nối từ vui và hơn thế nữa
        </div>
        <div className="has-text-centered mt-4 mb-4">
          <Link href="/" className="button">
            Chơi nối từ
          </Link>
        </div>
      </div>
      <div className="columns is-multiline w-100">
        {blogList.map((blog) => (
          <Link
            href={`/blog/${blog.code}`}
            key={blog.id}
            className="column is-one-third-desktop is-half-tablet cursor-pointer"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <Image
                    className={styles.cardImage}
                    src={blog.image}
                    alt={blog.title}
                    width={1000}
                    height={1000}
                  />
                </figure>
              </div>
              <div className="card-content">
                <div className="content">
                  <h4>{blog.title}</h4>
                  <p className={`${styles.description} is-size-6`}>
                    {blog.description}
                  </p>
                  <p className="is-size-7">
                    <time
                      dateTime={new Date(blog.createdDate).toLocaleDateString()}
                    >
                      {new Date(blog.createdDate).toLocaleDateString("vi-VN")}
                    </time>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
