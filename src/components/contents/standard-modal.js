const { useEffect } = require("react");

const StandardModal = (props) => {
  // On press 'ESC' key, close the modal
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <div id={props.id} className="modal is-active">
        <div
          className="modal-background"
          onClick={() => {
            if (!props.uncloseable) {
              props.onClose();
            }
          }}
        ></div>
        <div className="modal-content">
          <div className="box">{props.children}</div>
        </div>
        {!props.uncloseable && (
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={props.onClose}
          ></button>
        )}
      </div>
    </>
  );
};

export default StandardModal;
