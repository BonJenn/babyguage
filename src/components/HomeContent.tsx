'use client';

import Link from 'next/link';
import BlogList from './BlogList';
import PregnancyCalculator from './PregnancyCalculator';
import { BlogPost } from '../types/blog';

const categories = [
  {
    name: 'Fertility',
    description: 'Conception tips, fertility tracking, and reproductive health',
    icon: '🌱',
    tags: ['fertility', 'ovulation', 'conception', 'reproductive health']
  },
  {
    name: 'Pregnancy',
    description: 'Pregnancy stages, symptoms, and prenatal care',
    icon: '🤰',
    tags: ['pregnancy', 'prenatal', 'trimester', 'baby development']
  },
  {
    name: 'Wellness',
    description: 'Health, nutrition, and lifestyle for fertility',
    icon: '💪',
    tags: ['wellness', 'nutrition', 'exercise', 'mental health']
  },
  {
    name: 'Family Planning',
    description: 'Birth control, family planning, and preconception',
    icon: '👨‍👩‍👦',
    tags: ['family planning', 'birth control', 'preconception']
  }
];

export default function HomeContent({ posts }: { posts: BlogPost[] }) {
  const scrollToCalculator = () => {
    const calculator = document.getElementById('calculator-section');
    calculator?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 
                         bg-clip-text text-transparent">
              Your Journey to Parenthood Starts Here
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Expert guidance, personalized insights, and a supportive community for your fertility journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="px-8 py-3 bg-pink-500 text-white rounded-full 
                         hover:bg-pink-600 transition-all duration-200 shadow-lg
                         text-center"
              >
                Explore Articles
              </Link>
              <button
                onClick={scrollToCalculator}
                className="px-8 py-3 bg-white text-pink-600 rounded-full 
                         hover:bg-pink-50 transition-all duration-200 shadow-lg
                         flex items-center justify-center gap-2"
              >
                <span>AI Pregnancy Calculator</span>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog/category/${encodeURIComponent(category.name.toLowerCase())}`}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 border border-pink-100"
              >
                <span className="text-4xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 
                             transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator-section" className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Pregnancy Probability Calculator</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get a personalized assessment of your conception probability using our advanced AI calculator.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PregnancyCalculator />
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest articles on fertility, pregnancy, and women's health.
            </p>
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <BlogList posts={posts} />
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-pink-200 
                       rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
            >
              View All Articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
