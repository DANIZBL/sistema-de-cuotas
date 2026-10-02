import { useEffect, useRef } from "react";

import "./Modal.css";

// Pila de modales abiertas, compartida entre todas las instancias.
// La última del array es la que está arriba de todo.
const openModals = [];

let previousBodyOverflow = "";

function Modal({ title, children, onClose, className = "" }) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const modalId = {};

    // Solo la primera modal bloquea el scroll del body.
    if (openModals.length === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    openModals.push(modalId);

    function handleEscape(event) {
      // Solo se cierra la modal que está arriba de todo.
      if (
        event.key === "Escape" &&
        openModals[openModals.length - 1] === modalId
      ) {
        onCloseRef.current();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);

      const index = openModals.indexOf(modalId);

      if (index !== -1) {
        openModals.splice(index, 1);
      }

      // Solo la última modal en cerrarse restaura el scroll del body.
      if (openModals.length === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal ${className}`}>
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
