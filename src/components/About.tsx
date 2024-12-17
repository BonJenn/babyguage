export default function About() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 
                       bg-clip-text text-transparent">
            About Baby Gauge
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering women with AI-driven insights for their fertility and pregnancy journey.
          </p>
        </div>
  
        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 md:p-12 
                       border border-pink-100">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Baby Gauge combines cutting-edge AI technology with evidence-based medical knowledge 
              to provide personalized guidance throughout your fertility and pregnancy journey. 
              We believe in making expert information accessible to everyone, helping you make 
              informed decisions about your reproductive health.
            </p>
          </div>
        </div>
  
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 
                       border border-pink-100 shadow-sm">
            <div className="text-pink-500 mb-4 text-4xl">🎯</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Accurate Predictions</h3>
            <p className="text-gray-600">
              Our AI-powered calculator provides precise estimations for your pregnancy journey.
            </p>
          </div>
  
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 
                       border border-pink-100 shadow-sm">
            <div className="text-pink-500 mb-4 text-4xl">📚</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Expert Content</h3>
            <p className="text-gray-600">
              Access comprehensive articles written by AI, reviewed by healthcare professionals.
            </p>
          </div>
  
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 
                       border border-pink-100 shadow-sm">
            <div className="text-pink-500 mb-4 text-4xl">🤝</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Community Support</h3>
            <p className="text-gray-600">
              Join a supportive community of women sharing similar experiences.
            </p>
          </div>
        </div>
  
        {/* Team Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 md:p-12 
                     border border-pink-100">
          <h2 className="text-3xl font-semibold mb-12 text-center text-gray-900">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden 
                           bg-pink-100 flex items-center justify-center">
                <span className="text-4xl">👩🏽‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Dr. Sarah Johnson</h3>
              <p className="text-gray-600">Medical Advisor</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden 
                           bg-pink-100 flex items-center justify-center">
                <span className="text-4xl">👩🏻‍💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Emma Chen</h3>
              <p className="text-gray-600">Lead Writer</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden 
                           bg-pink-100 flex items-center justify-center">
                <span className="text-4xl">👨🏾‍💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Michelle Torres</h3>
              <p className="text-gray-600">Health Writer</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden 
                           bg-pink-100 flex items-center justify-center">
                <span className="text-4xl">👩🏼‍🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Lisa Park</h3>
              <p className="text-gray-600">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    );
  }