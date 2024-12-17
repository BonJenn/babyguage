export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 
                     bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      
      <div className="prose prose-pink max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-600">
            At BabyGauge.com, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, and protect your personal information when you use our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          <p className="text-gray-600">
            We collect information that you voluntarily provide to us when using our pregnancy calculator 
            and other services. This may include:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-600">
            <li>Age and health information</li>
            <li>Menstrual cycle data</li>
            <li>Email address (if provided for newsletters)</li>
            <li>Usage data and cookies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-600">
            <li>Provide accurate pregnancy probability calculations</li>
            <li>Improve our services and user experience</li>
            <li>Send relevant newsletters and updates (with consent)</li>
            <li>Analyze website usage patterns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal information. 
            Your data is encrypted and stored securely.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@babyguage.com" className="text-pink-600 hover:text-pink-700">
              privacy@babyguage.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
