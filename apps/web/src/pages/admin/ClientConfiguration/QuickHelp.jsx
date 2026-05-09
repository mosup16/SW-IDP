import { useState } from "react";
import { ChevronRight, Info } from "lucide-react";

const faqs = [
  {
    question: "What is a Redirect URI?",
    answer: "A Redirect URI is the URL that the authorization server sends the user back to after they have successfully authorized the application. It must match exactly with the one configured in your client settings to prevent security risks.",
  },
  {
    question: "Client Type?",
    answer: "Client types indicate whether the application is confidential or public. Confidential clients (like web apps with backends) can keep secrets, while public clients (like SPA or mobile apps) cannot.",
  },
];

export default function QuickHelp() {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
        <div className="cc-sublabel mb-3">Quick Help</div>
        {faqs.map(faq => (
          <div key={faq.question} className="border-top">
            <button
              onClick={() => setExpanded(expanded === faq.question ? null : faq.question)}
              className="btn btn-link w-100 text-start text-dark d-flex justify-content-between align-items-center py-3 px-0 fw-medium small text-decoration-none"
            >
              <span>{faq.question}</span>
              <ChevronRight
                size={16}
                color="#8c8c8c"
                className={`cc-chevron flex-shrink-0 ${expanded === faq.question ? "cc-chevron--open" : ""}`}
              />
            </button>
            {expanded === faq.question && (
              <div className="small text-secondary pb-3 lh-base">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}