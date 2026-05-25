import React, { useEffect, useState } from 'react';
import { CheckCircle, Copy } from 'lucide-react';

export default function SuccessPage({ paymentMethod, onReset }) {
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Générer un code de référence aléatoire, ex: REF-2024-X89K
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'REF-' + new Date().getFullYear() + '-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setReference(code);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="slide-in" style={{ position: 'relative', zIndex: 2 }}>
      <div className="step-indicator">Step 3/3</div>
      <div className="header-area" style={{ textAlign: 'left' }}>
        <h2>Confirmation</h2>
        <p>Demande enregistrée avec succès</p>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 2.5rem 0', opacity: 0.5 }}></div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        
        <p style={{ margin: '1rem 0', color: 'var(--text-main)' }}>
          {paymentMethod === 'card' && 'Votre paiement par carte a été initié.'}
          {paymentMethod === 'transfer' && 'Votre intention de virement a bien été notée.'}
          {paymentMethod === 'direct_debit' && 'Votre demande de prélèvement automatique est enregistrée.'}
        </p>
      </div>

      <div className="reference-box" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--border)', padding: '2rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Voici votre code de référence de paiement :</p>
        <div className="reference-code" style={{ color: 'var(--primary)', fontSize: '1.75rem', margin: '1.5rem 0' }}>
          {reference}
        </div>
        <button 
          className="btn-secondary" 
          onClick={handleCopy}
          style={{ width: 'auto', display: 'inline-flex', padding: '0.6rem 1.5rem', margin: 0 }}
        >
          <Copy size={16} /> {copied ? 'Copié !' : 'Copier le code'}
        </button>
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px solid #FECACA' }}>
        <p style={{ fontWeight: '600', color: 'var(--error)' }}>Action requise :</p>
        <p style={{ fontSize: '0.9rem', color: '#991B1B', marginTop: '0.5rem' }}>Veuillez transmettre ce code de référence à votre agence pour valider votre paiement.</p>
      </div>

      <div className="buttons-row">
        <button className="btn-primary" onClick={onReset}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
