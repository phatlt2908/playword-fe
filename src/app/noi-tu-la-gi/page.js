import Image from "next/image";

export const metadata = {
  title: "Nối từ là gì | Chơi nối từ online",
  description:
    "Nối từ là gì? Nối từ là trò chơi nối các từ với nhau bằng cách sử dụng chữ cái cuối cùng của từ trước để tạo thành một từ mới hợp lệ. Chơi nối từ rất đơn giản nhưng thú vị dành cho mọi lứa tuổi.",
};

export default function Manual() {
  return (
    <div className="content">
      <h1>Nối từ là gì? Hướng dẫn cách chơi nối từ</h1>
      <p>
        Nối từ là một trò chơi trí tuệ đơn giản nhưng thú vị dành cho mọi lứa
        tuổi. Mục tiêu của trò chơi là nối các từ với nhau bằng cách sử dụng chữ
        cái cuối cùng của từ trước để tạo thành một từ mới hợp lệ.
      </p>

      <div className="is-block has-text-centered p-4">
        <a className="button p-static" href="/">
          Chơi ngay
        </a>
      </div>

      <div className="has-text-centered">
        <Image
          className="has-text-centered"
          src="/what-is-noi-tu.jpg"
          alt="banner"
          width={300}
          height={300}
        />
      </div>

      <h2>Cách chơi</h2>
      <p>
        Khi trong nhóm đang có 2 thành viên hoặc nhiều hơn, cách chơi sẽ như
        sau:
      </p>
      <ol>
        <li>Người chơi đầu tiên chọn một từ bất kỳ và nói ra.</li>
        <li>
          Người chơi tiếp theo phải nối từ của người chơi trước bằng cách sử
          dụng chữ cái cuối cùng của từ đó để tạo thành một từ mới hợp lệ.
        </li>
        <li>
          Quá trình này tiếp tục cho đến khi một người chơi không thể nghĩ ra từ
          hợp lệ hoặc phạm luật.
        </li>
        <li>Người chơi cuối cùng nối từ thành công sẽ là người chiến thắng.</li>
      </ol>
      <p>
        Nếu xa xôi cách trở, không thể tụ họp được bạn bè, thì đây nè...
        noitu.fun sẽ kết nối giúp bạn. Chỉ cần chọn chế độ chơi{" "}
        <a className="text-underlined" href="/nhieu-minh">
          nhiều mình
        </a>
        , tạo phòng hoặc vào phòng có sẵn và chia sẻ đến bạn bè để cùng nối từ
        nhé.
      </p>
      <p>
        Chơi cùng bạn bè sẽ vui hơn. Tuy nhiên, nếu bạn đang FA thì cũng không
        sao, hãy thử với chế độ chơi solo{" "}
        <a className="text-underlined" href="/mot-minh">
          một mình
        </a>{" "}
        😌
      </p>
      <div className="has-text-centered">
        <Image src="/banner.png" alt="banner" width={300} height={300} />
      </div>

      <h2>Luật chơi</h2>
      <ul>
        <li>
          Từ nối phải là một từ tiếng Việt hợp lệ, có nghĩa và được ghi chép
          trong từ điển.
        </li>
        <li>
          Từ nối không được phép lặp lại các từ đã được sử dụng trước đó trong
          ván chơi.
        </li>
        <li>
          Từ nối không được phép sử dụng các từ ghép, từ viết tắt, hoặc từ có
          dấu (ký tự đặc biệt).
        </li>
        <li>
          Nếu một người chơi không thể nghĩ ra từ hợp lệ trong vòng 20 giây, họ
          sẽ bị loại khỏi ván chơi.
        </li>
      </ul>

      <h2>Lợi ích</h2>
      <ul>
        <li>Nâng cao vốn từ vựng và khả năng sử dụng ngôn ngữ.</li>
        <li>Rèn luyện khả năng suy nghĩ logic và giải quyết vấn đề.</li>
        <li>Tăng cường khả năng giao tiếp và kết nối với người khác.</li>
        <li>Mang lại những giây phút thư giãn và giải trí.</li>
      </ul>

      <div className="is-block has-text-centered">
        <a className="button p-static" href="/">
          Chơi ngay
        </a>
      </div>
    </div>
  );
}
