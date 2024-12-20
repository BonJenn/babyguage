import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Baby</span>
              <span className="text-gray-900">Gauge</span>
              <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">.com</span>
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
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/category/fertility" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Fertility
                </Link>
              </li>
              <li>
                <Link href="/blog/category/pregnancy" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Pregnancy
                </Link>
              </li>
              <li>
                <Link href="/blog/category/wellness" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Wellness
                </Link>
              </li>
              <li>
                <Link href="/blog/category/family-planning" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Family Planning
                </Link>
              </li>
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
