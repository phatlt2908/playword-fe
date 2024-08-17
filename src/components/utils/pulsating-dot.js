import styles from "./pulsating-dot.module.css";

function PulsatingDot() {
  return (
    <div className={styles.ringContainer}>
      {/* <div className={styles.ringring}></div> */}
      <div className={styles.circle}></div>
    </div>
  );
}

export default PulsatingDot;
