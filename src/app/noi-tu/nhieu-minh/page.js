"use client";

import { useRouter } from "next/navigation";

const WordLinkMultiSelection = () => {
  const router = useRouter();

  const onCreateRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 8);
    router.push(`/noi-tu/nhieu-minh/${roomCode}`);
  };

  return (
    <>
      <div className="button" onClick={() => onCreateRoom()}>
        Tao phong
      </div>
      <hr />
      <div>Vao phong</div>
    </>
  );
};

export default WordLinkMultiSelection;
