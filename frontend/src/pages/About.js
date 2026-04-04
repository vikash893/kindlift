import React from 'react';

export const About = () => {
  const developers = [
    {
      name: "Vikash",
      role: "Lead Full Stack Developer",
      description: "Passionate about building scalable applications and creating seamless user experiences.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      github: "#",
      linkedin: "#",
      email: "rajesh@kindlift.com"
    },
    {
      name: "Vishnu Singh rajput",
      role: "UI/UX Designer & Frontend Developer",
      description: "Creates beautiful, intuitive interfaces that users love.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      github: "#",
      linkedin: "#",
      email: "priya@kindlift.com"
    },
    {
      name: "yash gupta",
      role: "Security Engineer",
      description: "Specializes in AI algorithms and route optimization.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      github: "#",
      linkedin: "#",
      email: "amit@kindlift.com"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
          About Kindlift
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to reshape how the world commutes, one shared ride at a time.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-500 inline-block pb-2">
            Our Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Kindlift was born from a simple idea: empty seats in cars are a wasted resource. 
            In a world facing climate change and rising fuel costs, we built a platform that 
            brings people together while taking cars off the road.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By leveraging smart routing, real-time matching, and a unique coin-reward system, 
            we've transformed ride-sharing from a transaction into a community-driven movement.
          </p>
        </div>

        {/* Stats Cards - Using emojis instead of icons */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl text-center shadow-lg">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-bold text-2xl mb-2">10k+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl text-center shadow-lg">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="font-bold text-2xl mb-2">50+</h3>
            <p className="text-gray-600">Cities Covered</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl text-center shadow-lg">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-bold text-2xl mb-2">500t</h3>
            <p className="text-gray-600">CO2 Saved</p>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-600">
            Passionate developers working together to make travel better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={dev.image} 
                  alt={dev.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{dev.name}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">{dev.role}</p>
                <p className="text-gray-600 mb-4">{dev.description}</p>
                
                {/* Social Links - Using text/emojis instead of icons */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <a href={dev.github} className="text-gray-600 hover:text-gray-900 transition text-sm flex items-center gap-1">
                    <span>🐙</span> GitHub
                  </a>
                  <a href={dev.linkedin} className="text-gray-600 hover:text-blue-600 transition text-sm flex items-center gap-1">
                    <span>🔗</span> LinkedIn
                  </a>
                  <a href={`mailto:${dev.email}`} className="text-gray-600 hover:text-red-500 transition text-sm flex items-center gap-1">
                    <span>📧</span> Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center border-t border-gray-200 pt-8">
        <p className="text-gray-500">
          Built with <span className="text-red-500">❤️</span> by the Kindlift team
        </p>
      </div>
    </div>
  );
};