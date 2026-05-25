import React, { useState } from 'react';
import { CreditCard, Landmark, Repeat, Loader2 } from 'lucide-react';

export default function PaymentMethods({ tenantData, onPaymentComplete, onBack }) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rib, setRib] = useState('');

  const [showRedirectPopup, setShowRedirectPopup] = useState(false);

  const handleTaraPayment = async () => {
    setIsProcessing(true);
    setShowRedirectPopup(true);
    try {
      // Attendre 4 secondes pour l'effet visuel de redirection + l'appel API
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 4000));
      
      const fetchPromise = fetch('/api/tara/paymentlinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: 'eO4qfliMGo6yvkSmPqDPKUoH', 
          businessId: '5AuML9WXgI',
          productId: `loyer-${Date.now()}`,
          productName: `Paiement Loyer - ${tenantData.firstName} ${tenantData.lastName}`,
          productPrice: Math.round(parseFloat(tenantData.rentAmount.toString().replace(',', '.')) * 655.957), 
          currency: 'EUR',
          productDescription: `Paiement de loyer pour ${tenantData.address}`,
          productPictureUrl: 'https://placehold.co/400',
          returnUrl: window.location.protocol === 'https:' ? window.location.href : 'https://votre-site-en-production.com/success', 
          webHookUrl: 'https://example.com/webhook'
        }),
      }).then(res => res.json());

      const [, data] = await Promise.all([minDelayPromise, fetchPromise]);
      
      if ((data.status === 'SUCCESS' || data.status === 'success') && data.cardLink) {
        window.location.href = data.cardLink;
      } else {
        setShowRedirectPopup(false);
        alert(`Erreur lors de la génération du lien de paiement Tara: ${data.message || 'Erreur inconnue'}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setShowRedirectPopup(false);
      alert('Erreur de connexion à l\'API Tara Money. Mode test activé : Simulation du succès.');
      // Fallback pour la démo / test
      setTimeout(() => {
        onPaymentComplete('card');
      }, 1500);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (selectedMethod === 'card') {
      handleTaraPayment();
    } else if (selectedMethod === 'transfer') {
      onPaymentComplete('transfer');
    } else if (selectedMethod === 'direct_debit') {
      if (!rib) {
        alert('Veuillez renseigner votre RIB.');
        return;
      }
      onPaymentComplete('direct_debit', rib);
    }
  };

  return (
    <div className="slide-in" style={{ position: 'relative', zIndex: 2 }}>
      <div className="step-indicator">Step 2/3</div>
      <div className="header-area" style={{ textAlign: 'left' }}>
        <h2>Mode de Paiement</h2>
        <p>Montant total à régler pour votre loyer : <strong>{tenantData.rentAmount} €</strong></p>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 2.5rem 0', opacity: 0.5 }}></div>

      <div className="payment-methods">
        <div 
          className={`payment-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          <div className="payment-icon">
            <CreditCard size={20} />
          </div>
          <div className="payment-info">
            <h4>Carte Bancaire</h4>
            <p>Paiement sécurisé via Tara Money</p>
          </div>
        </div>

        <div 
          className={`payment-method-card ${selectedMethod === 'transfer' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('transfer')}
        >
          <div className="payment-icon">
            <Landmark size={20} />
          </div>
          <div className="payment-info">
            <h4>Virement Bancaire</h4>
            <p>Obtenez le RIB de l'agence pour effectuer le virement</p>
          </div>
        </div>

        <div 
          className={`payment-method-card ${selectedMethod === 'direct_debit' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('direct_debit')}
        >
          <div className="payment-icon">
            <Repeat size={20} />
          </div>
          <div className="payment-info">
            <h4>Prélèvement Automatique</h4>
            <p>Renseignez votre RIB pour un prélèvement mensuel</p>
          </div>
        </div>
      </div>

      {selectedMethod === 'direct_debit' && (
        <div className="form-group slide-in" style={{ marginBottom: '2rem' }}>
          <label className="form-label">Votre RIB / IBAN</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="FR76 1234 5678 9012 3456 7890 123"
            value={rib}
            onChange={(e) => setRib(e.target.value)}
          />
        </div>
      )}

      {selectedMethod === 'transfer' && (
        <div className="bank-details slide-in" style={{ textAlign: 'left', backgroundColor: '#F8FAFC', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Coordonnées de l'agence</h4>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}><strong>Banque:</strong> Banque Exemple</p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}><strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123</p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}><strong>BIC:</strong> EXAMPBXX</p>
          <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
            Veuillez utiliser le code de référence qui vous sera fourni comme libellé du virement.
          </p>
        </div>
      )}

      <div className="buttons-row">
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={onBack}
          disabled={isProcessing}
        >
          Retour
        </button>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Traitement en cours...' : 'Confirmer le paiement'}
        </button>
      </div>

      {showRedirectPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .popup-content {
              background: white;
              padding: 2.5rem;
              border-radius: var(--radius-lg);
              text-align: center;
              box-shadow: var(--shadow-lg);
              max-width: 400px;
              width: 90%;
            }
            @media (max-width: 600px) {
              .popup-content {
                padding: 1.5rem;
                border-radius: var(--radius-md);
              }
              .popup-content h3 {
                font-size: 1.1rem !important;
              }
              .popup-content p {
                font-size: 0.85rem !important;
              }
              .popup-content svg {
                width: 36px;
                height: 36px;
                margin-bottom: 1rem !important;
              }
            }
          `}</style>
          <div className="slide-in popup-content">
            <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }} className="popup-spinner" />
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>Redirection sécurisée</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Veuillez patienter, vous allez être redirigé vers l'interface de paiement sécurisée de notre partenaire Tara Money...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
