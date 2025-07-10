import React, { useState } from 'react';
import './App.css';

type Devise = 'EUR' | 'USD' | 'GBP';

const tauxChange: Record<Devise, number> = {
  EUR: 0.30, // exemple : 1 DT = 0.30 EUR
  USD: 0.33,
  GBP: 0.26,
};

function App() {
  const [montant, setMontant] = useState<number>(0);
  const [devise, setDevise] = useState<Devise>('EUR');
  
  const conversion = (montant * tauxChange[devise]).toFixed(2);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Convertisseur de Dinar Tunisien</h2>

      <input
        type="number"
        placeholder="Montant en DT"
        value={montant}
        onChange={(e) => setMontant(parseFloat(e.target.value))}
      />

      <select value={devise} onChange={(e) => setDevise(e.target.value as Devise)}>
        <option value="EUR">Euro (€)</option>
        <option value="USD">Dollar ($)</option>
        <option value="GBP">Livre (£)</option>
      </select>

      <h3>Résultat : {conversion} {devise}</h3>
    </div>
  );
}

export default App;
