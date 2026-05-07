import React from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/ClientConfiguration.css';

const SecurityStandards = () => {
  return (
    <div className="security-card">
      <div className="security-card__header">
        <Icon.ShieldCheck size={22} />
        <h3 className="security-card__title">Security Standards</h3>
      </div>

      <div className="security-card__row">
        <span className="security-card__num">01</span>
        <span className="security-card__badge">https://</span>
      </div>

      <div className="security-card__row">
        <span className="security-card__num">02</span>
        <span className="security-card__label">OAuth 2.1</span>
      </div>

      <div className="security-card__row">
        <span className="security-card__num">03</span>
        <span className="security-card__label">Sovereign IdP</span>
      </div>
    </div>
  );
};

export default SecurityStandards;