import { Metadata } from 'next'
import { siteConfig } from '../config/site'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GoogleAnalytics from '../components/GoogleAnalytics'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Baby Gauge - Pregancy and Fertility Calculator",
      url: siteConfig.url,
    },
  ],
  creator: "Baby Gauge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.links?.twitter || "@babyguage"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFF5F6] text-gray-800">
        <Header />
        <main className="flex-grow px-4 sm:px-6 lg:px-8 
                        bg-gradient-to-b from-pink-50/50 to-white/50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
