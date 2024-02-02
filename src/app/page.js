import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <>
      <div className={styles.center}>
        <div className="columns is-multiline is-centered is-mobile w-100">
          <div
            id="splatoon"
            className="column is-one-fifth-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/en/4/49/Splatoon_2.jpg"
                    alt="Splatoon 2"
                    width={500}
                    height={500}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
          <div
            id="super-smash-bros"
            className="column is-one-fifth-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <Image
                    src="https://img-eshop.cdn.nintendo.net/i/08af58551a19df2a73ccb36f720388434a1965776b34675c6f69af3f93280330.jpg"
                    alt="Super Smash Bros Ultimate"
                    width={500}
                    height={500}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
          <div
            id="breath-of-the-wild"
            className="column is-one-fifth-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <Image
                    src="https://i2.wp.com/fantasy-hive.co.uk/wp-content/uploads/2017/09/Zelda-Breath-of-the-Wild-Thumbnail.jpg?resize=300%2C300&ssl=1"
                    alt="Breath of the Wild"
                    width={500}
                    height={500}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
          <div
            id="celeste"
            className="column is-one-fifth-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <Image
                    src="https://publish.one37pm.net/wp-content/uploads/2018/12/celeste-mobile.jpg"
                    alt="Celeste"
                    width={500}
                    height={500}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
          <div
            id="animal-crossing"
            className="column is-one-fifth-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile"
          >
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg"
                    alt="Animal Crossing New Horizons"
                    width={500}
                    height={500}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
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
