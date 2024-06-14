import Link from "next/link";

const WordLink = () => {
  return (
    <>
      <Link href="/noi-tu/mot-minh">
        <div className="button">Mot minh</div>
      </Link>
      <Link href="/noi-tu/nhieu-minh">
        <div className="button">Nhieu minh</div>
      </Link>
    </>
  );
};

export default WordLink;
