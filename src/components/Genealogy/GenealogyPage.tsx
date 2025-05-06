import React, { useState } from 'react';
import { GenealogyTree } from './GenealogyTree';
import genealogyData from '../../data/genealogy.json';
import './GenealogyPage.scss';

export const GenealogyPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (password === import.meta.env.VITE_GENEALOGY_PASS) {
      setUnlocked(true);
      setShowModal(false);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="genealogy-page">
      <div className="genealogy-header">
        <h1>Árbol Genealógico</h1>
      </div>
      {!unlocked && (
        <button className="unlock-btn-floating" onClick={() => setShowModal(true)}>
          <span role="img" aria-label="lock">🔒</span>
        </button>
      )}
      <GenealogyTree data={genealogyData} unlocked={unlocked} />
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Introduce la contraseña</h2>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            {error && <div className="error">{error}</div>}
            <button onClick={handleUnlock}>Desbloquear</button>
          </div>
        </div>
      )}
    </div>
  );
}; 