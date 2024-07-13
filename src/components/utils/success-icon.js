import styles from "./success-icon.module.scss";

const SuccessIcon = () => {
  return (
    <div className={styles.checkmark}>
      <div className={styles.checkIcon}>
        <span className={`${styles.iconLine} ${styles.lineTip}`}></span>
        <span className={`${styles.iconLine} ${styles.lineLong}`}></span>
        <div className={styles.iconCircle}></div>
        <div className={styles.iconFix}></div>
      </div>
    </div>
  );
};

export default SuccessIcon;
