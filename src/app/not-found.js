"use client";

import { useEffect } from "react";

export default function Custom404() {
  useEffect(() => {
    window.location.href = "/";
  }, []);
  return (
    <>
      <a href="/">Trang chủ</a>
      <h1>404 - Page Not Found</h1>
    </>
  );
}
