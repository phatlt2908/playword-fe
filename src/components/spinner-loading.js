"use client";

import styles from "./spinner-loading.module.scss";

function SpinnerLoading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={`${styles.loader} loader`}></div>
    </div>
  );
}

export default SpinnerLoading;
