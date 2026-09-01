import React, { useState } from "react";
import "./FAQs.css";

function FAQ() {
  const faqs = [
    {
      question: "What should I do if my medicine is near expiry?",
      answer: "Our system automatically flags near-expiry medicines. Please contact the pharmacy or admin if you receive a near-expiry medicine.",
    },
    {
      question: "Can I update my stock as a staff member?",
      answer: "Yes, if you have staff access, you can update medicine stock from the 'Update Stock' section after logging in.",
    },
    {
      question: "How do I know if a medicine is out of stock?",
      answer: "Out-of-stock medicines are shown as 'Not Available' or 'Expired' in the medicine list. You will also get alerts for low stock medicines if enabled.",
    },
    {
      question: "Who can I contact for urgent medical requests?",
      answer: "You can contact the admin or pharmacy directly using the contact number provided in your account dashboard.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
