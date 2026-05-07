import React, { useState } from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/ClientConfiguration.css';

const QuickHelp = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'What is a Redirect URI?',
      answer: 'A Redirect URI is the URL that the authorization server sends the user back to after they have successfully authorized the application. It must match exactly with the one configured in your client settings to prevent security risks.',
    },
    {
      question: 'Client Type?',
      answer: 'Client types indicate whether the application is confidential or public. Confidential clients (like web apps with backends) can keep secrets, while public clients (like SPA or mobile apps) cannot.',
    },
  ];

  return (
    <div className="help-card">
      <div className="help-card__title">Quick Help</div>

      {faqs.map((faq) => (
        <div key={faq.question} className="help-card__item">
          <button
            className="help-card__question"
            onClick={() => setExpandedFaq(expandedFaq === faq.question ? null : faq.question)}
          >
            <span>{faq.question}</span>
            <Icon.ChevronRight
              size={16}
              style={{
                color: '#8c8c8c',
                transition: 'transform 0.2s',
                transform: expandedFaq === faq.question ? 'rotate(90deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}
            />
          </button>
          {expandedFaq === faq.question && (
            <div className="help-card__answer">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickHelp;