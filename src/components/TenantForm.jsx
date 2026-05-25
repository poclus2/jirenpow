import React, { useState, useEffect, useRef } from 'react';

export default function TenantForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    rentAmount: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const searchAddress = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Erreur API Adresse:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'address') {
      searchAddress(value);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, address: suggestion.properties.label }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="slide-in" style={{ position: 'relative', zIndex: 2 }}>
      <div className="step-indicator">Step 1/3</div>
      <div className="header-area" style={{ textAlign: 'left' }}>
        <h2>Informations de base</h2>
        <p>Parlez-nous un peu de vous pour configurer votre paiement de loyer sécurisé.</p>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 2.5rem 0', opacity: 0.5 }}></div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Prénom</label>
            <input 
              type="text" 
              name="firstName"
              className="form-input" 
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nom</label>
            <input 
              type="text" 
              name="lastName"
              className="form-input" 
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="johndoe123@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width" style={{ position: 'relative' }} ref={dropdownRef}>
            <label className="form-label">Adresse du bien loué</label>
            <input 
              type="text" 
              name="address"
              className="form-input" 
              placeholder="123 Rue de la République, 75001 Paris"
              value={formData.address}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            
            {/* Dropdown autocomplétion */}
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                marginTop: '4px',
                zIndex: 10,
                listStyle: 'none',
                padding: '0.5rem 0',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {suggestions.map((suggestion) => (
                  <li 
                    key={suggestion.properties.id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    style={{
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid #F3F4F6'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                      {suggestion.properties.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {suggestion.properties.postcode} {suggestion.properties.city}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group full-width">
            <label className="form-label">Montant du loyer (€)</label>
            <input 
              type="number" 
              name="rentAmount"
              className="form-input" 
              placeholder="850"
              value={formData.rentAmount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Suivant
        </button>
      </form>
    </div>
  );
}
