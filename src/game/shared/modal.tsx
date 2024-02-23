import React from 'react';
import './modal.css'; // Import your CSS file

interface ModalProps {
  onClose: () => void; // Define the type of onClose prop
  player: string;
}


function Modal({ onClose, player }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>WINNER WINNER CHICKEN DINNER</h2>
        <p>{player} WINS</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    </div>
  );
}

export default Modal;