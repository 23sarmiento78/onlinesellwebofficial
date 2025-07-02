import React, { useState } from 'react';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = idx => setOpenIndex(openIndex === idx ? -1 : idx);

  return (
    <div className="accordion" id="faqAccordion">
      {faqs.map((faq, idx) => (
        <div className="accordion-item" key={idx}>
          <h3 className="accordion-header">
            <button
              className={`accordion-button${openIndex === idx ? '' : ' collapsed'}`}
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq${idx}`}
            >
              {faq.question}
            </button>
          </h3>
          <div
            id={`faq${idx}`}
            className={`accordion-collapse collapse${openIndex === idx ? ' show' : ''}`}
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 