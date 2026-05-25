import React, { useState } from 'react';
import TenantForm from './components/TenantForm';
import PaymentMethods from './components/PaymentMethods';
import SuccessPage from './components/SuccessPage';
import { User, CreditCard, CheckCircle2 } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [tenantData, setTenantData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleFormSubmit = (data) => {
    setTenantData(data);
    setStep(2);
  };

  const handlePaymentComplete = (method, extraData = null) => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setTenantData(null);
    setPaymentMethod(null);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="app-container">
      {/* Sidebar (Left Column) */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Locanto
        </div>

        <div className="steps-container">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-icon">
              <User size={18} />
            </div>
            <div className="step-content">
              <h4>Vos informations</h4>
              <p>Détails du locataire</p>
            </div>
          </div>

          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-icon">
              <CreditCard size={18} />
            </div>
            <div className="step-content">
              <h4>Mode de paiement</h4>
              <p>Sélection et validation</p>
            </div>
          </div>

          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-icon">
              <CheckCircle2 size={18} />
            </div>
            <div className="step-content">
              <h4>Confirmation</h4>
              <p>Statut du paiement</p>
            </div>
          </div>
        </div>

        <div className="sidebar-pattern"></div>
        
        <div className="sidebar-footer">
          All rights reserved @Locanto
        </div>
      </div>

      {/* Content Area (Right Column) */}
      <div className="content-area">
        <div className="content-pattern"></div>
        
        {step === 1 && (
          <TenantForm onSubmit={handleFormSubmit} />
        )}
        
        {step === 2 && (
          <PaymentMethods 
            tenantData={tenantData} 
            onPaymentComplete={handlePaymentComplete}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <SuccessPage 
            paymentMethod={paymentMethod}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
