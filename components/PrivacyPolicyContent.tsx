import React from 'react';

const PrivacyPolicyContent: React.FC = () => (
    <>
      <p className="text-sm text-gray-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">1. Introduction</h3>
      <p>
        Welcome to Morse Code Master. We are committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">2. Information We Collect</h3>
      <p>
        We collect very limited information:
        <ul className="list-disc list-inside ml-4">
          <li><strong>Game Progress:</strong> We use your browser's local storage to save your progress, specifically the highest level you have unlocked. This data is stored only on your device and is not transmitted to our servers.</li>
          <li><strong>No Personal Data:</strong> We do not collect, store, or process any personally identifiable information (PII) such as your name, email address, or IP address.</li>
        </ul>
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">3. Third-Party Services</h3>
      <p>
        <strong>Google Gemini API:</strong> The "AI Hint" feature uses the Google Gemini API to generate mnemonics. When you request a hint, the character for which you need a hint is sent to Google's servers. We do not send any personal information with this request. Your interaction with the Gemini API is subject to Google's Privacy Policy.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">4. Data Security</h3>
      <p>
        Since all your progress data is stored locally on your device, you are in control of it. We do not have access to this data. Clearing your browser's cache or local storage will delete your progress.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">5. Changes to This Privacy Policy</h3>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h3 className="text-lg font-semibold text-teal-500 dark:text-teal-400">6. Contact Us</h3>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:officialsahilkamble@gmail.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">officialsahilkamble@gmail.com</a>.
      </p>
    </>
);

export default PrivacyPolicyContent;