import React from 'react';

const TermsAndConditionsContent: React.FC = () => (
    <>
      <p className="text-sm text-gray-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">1. Acceptance of Terms</h3>
      <p>
        By accessing and using Morse Code Master (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">2. Use of the Service</h3>
      <p>
        This Service is provided for your personal, non-commercial use only. You agree not to use the Service for any purpose that is unlawful or prohibited by these terms. You are responsible for all your activity in connection with the Service.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">3. API Key Usage</h3>
      <p>
        The Service's AI features require a Google Gemini API key to function. This key is used locally within your browser and is not collected or stored by us. You are responsible for securing your own API key and abiding by Google's terms of service regarding its use.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">4. Intellectual Property</h3>
      <p>
        The Service and its original content, features, and functionality are and will remain the exclusive property of its creators.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">5. Disclaimer of Warranties</h3>
      <p>
        The Service is provided "as is" without any warranties, express or implied. We do not warrant that the service will be uninterrupted, error-free, or secure.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">6. Limitation of Liability</h3>
      <p>
        In no event shall the creators of Morse Code Master be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
      </p>
      
      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">7. Changes to Terms</h3>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
      </p>
    </>
);

export default TermsAndConditionsContent;