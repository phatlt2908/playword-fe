import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.center}>
        <ul className={styles.game - list}>
          <li id="splatoon">
            <a href="#splatoon">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/4/49/Splatoon_2.jpg"
                alt="Splatoon 2"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
          <li id="super-smash-bros">
            <a href="#super-smash-bros">
              <Image
                src="https://img-eshop.cdn.nintendo.net/i/08af58551a19df2a73ccb36f720388434a1965776b34675c6f69af3f93280330.jpg"
                alt="Super Smash Bros Ultimate"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
          <li id="breath-of-the-wild">
            <a href="#breath-of-the-wild">
              <Image
                src="https://i2.wp.com/fantasy-hive.co.uk/wp-content/uploads/2017/09/Zelda-Breath-of-the-Wild-Thumbnail.jpg?resize=300%2C300&ssl=1"
                alt="Breath of the Wild"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
          <li id="celeste">
            <a href="#celeste">
              <Image
                src="https://publish.one37pm.net/wp-content/uploads/2018/12/celeste-mobile.jpg"
                alt="Celeste"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
          <li id="animal-crossing">
            <a href="#animal-crossing">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg"
                alt="Animal Crossing New Horizons"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
          <li id="kirby-star-allies">
            <a href="#kirby-star-allies">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/6/65/Kirby_Star_Allies.jpg"
                alt="Kirby Star Allies"
                width={500}
                height={500}
                priority
              />
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </>
  );
}
