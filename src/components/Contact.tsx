export default function Contact() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 
                       bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 
                       border border-pink-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 
                           focus:border-pink-300 focus:ring-2 focus:ring-pink-200 
                           focus:ring-opacity-50"
                  placeholder="Your name"
                />
              </div>
  
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 
                           focus:border-pink-300 focus:ring-2 focus:ring-pink-200 
                           focus:ring-opacity-50"
                  placeholder="your@email.com"
                />
              </div>
  
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 
                           focus:border-pink-300 focus:ring-2 focus:ring-pink-200 
                           focus:ring-opacity-50"
                  placeholder="Your message..."
                />
              </div>
  
              <button
                type="submit"
                className="w-full px-8 py-4 bg-pink-500 text-white rounded-xl 
                         hover:bg-pink-600 transition-all duration-200 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
  
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 
                         border border-pink-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-pink-500 text-2xl">📧</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@babyguage.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-pink-500 text-2xl">📱</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Social Media</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                        Twitter
                      </a>
                      <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                        Instagram
                      </a>
                      <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 
                         border border-pink-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    How quickly can I expect a response?
                  </h3>
                  <p className="text-gray-600">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Is my information secure?
                  </h3>
                  <p className="text-gray-600">
                    Yes, all communications are encrypted and your data is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }