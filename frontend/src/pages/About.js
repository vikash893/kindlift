import React from 'react';
import vikash from '../public/vikash.png';
import yash from '../public/yash.png';
import vishnu from '../public/vishnu.png';
import { ExternalLink, Link2, Mail } from 'lucide-react';

export const About = () => {
  const developers = [
    {
      name: 'Vikash',
      role: 'Lead Full Stack Developer',
      description: 'Passionate about building scalable applications and creating seamless user experiences.',
      image: vikash,
      github: '#',
      linkedin: '#',
      email: 'vikashbhardwaj430@gmail.com',
    },
    {
      name: 'Vishnu Singh Rajput',
      role: 'UI/UX Designer & Frontend Developer',
      description: 'Creates beautiful, intuitive interfaces that users love.',
      image: vishnu,
      github: 'https://github.com/vish3456',
      linkedin: 'https://www.linkedin.com/in/vishnu-singh-098033324/',
      email: 'rajputvishnu2513@gmail.com',
    },
    {
      name: 'Yash Gupta',
      role: 'Security Engineer',
      description: 'Specializes in AI algorithms and route optimization.',
      image: yash,
      github: '#',
      linkedin: '#',
      email: 'ygupta8875@gmail.com',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Active Users', icon: '👥' },
    { value: '50+', label: 'Cities Covered', icon: '🌍' },
    { value: '500t', label: 'CO₂ Saved', icon: '🌿' },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-4">
            About Kindlift
          </h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            We're on a mission to reshape how the world commutes, one shared ride at a time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-accent/10 text-brand-accent text-sm font-semibold rounded-full mb-4">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">
              Building a community of travelers
            </h2>
            <p className="text-brand-muted leading-relaxed mb-6">
              Kindlift was born from a simple idea: empty seats in cars are a wasted resource.
              In a world facing climate change and rising fuel costs, we built a platform that
              brings people together while taking cars off the road.
            </p>
            <p className="text-brand-muted leading-relaxed">
              By leveraging smart routing, real-time matching, and a unique coin-reward system,
              we've transformed ride-sharing from a transaction into a community-driven movement.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-card border border-gray-100 card-lift"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <h3 className="font-bold text-2xl text-brand-dark mb-1">{stat.value}</h3>
                <p className="text-sm text-brand-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">The Team</p>
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Meet the Builders</h2>
            <p className="text-brand-muted max-w-lg mx-auto">
              Passionate developers working together to make travel better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {developers.map((dev, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-lift group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{dev.name}</h3>
                    <p className="text-sm text-white/80">{dev.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-brand-muted mb-4">{dev.description}</p>
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <a href={dev.github} className="p-2 rounded-lg bg-brand-cream hover:bg-gray-100 transition-colors text-brand-dark/60 hover:text-brand-dark">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a href={dev.linkedin} className="p-2 rounded-lg bg-brand-cream hover:bg-gray-100 transition-colors text-brand-dark/60 hover:text-brand-dark">
                      <Link2 className="h-4 w-4" />
                    </a>
                    <a href={`mailto:${dev.email}`} className="p-2 rounded-lg bg-brand-cream hover:bg-gray-100 transition-colors text-brand-dark/60 hover:text-brand-dark">
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-20 text-center border-t border-gray-200 pt-8">
          <p className="text-sm text-brand-muted">
            Built with care by the Kindlift team
          </p>
        </div>
      </div>
    </div>
  );
};