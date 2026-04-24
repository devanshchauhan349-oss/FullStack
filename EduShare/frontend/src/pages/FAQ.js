import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      q: "What is EduShare?",
      a: "EduShare is a platform for collecting and sharing educational resources like PDFs, videos, notes, and links."
    },
    {
      q: "How do I upload resources?",
      a: "Sign up as a contributor, go to Dashboard > Upload, fill in the details, and submit for review."
    },
    {
      q: "What file types are allowed?",
      a: "We support PDF, MP4, JPEG, PNG, and external links from YouTube and other platforms."
    },
    {
      q: "How long does approval take?",
      a: "Admins typically review and approve resources within 24-48 hours."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{faq.q}</h3>
            <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;