export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 
                         bg-clip-text text-transparent">
              Baby Gauge
            </h3>
            <p className="text-gray-600 mb-4">
              Your trusted source for fertility, pregnancy, and women's health information.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links */}
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <span className="sr-only">Twitter</span>
                {/* Add social media icons */}
              </a>
              {/* Add more social links */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Contact', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              {['Fertility', 'Pregnancy', 'Wellness', 'Family Planning'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-pink-100">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Baby Gauge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
