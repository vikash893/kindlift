import React from 'react';
import vikash from '../public/vikash.png';
import yash from '../public/yash.png';
import vishnu from '../public/vishnu.png';
import { ExternalLink, Link2, Mail, ArrowUpRight } from 'lucide-react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';

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
      github: '#',
      linkedin: '#',
      email: 'vishnusingh@gmail.com',
    },
    {
      name: 'Yash Gupta',
      role: 'Security Engineer',
      description: 'Specializes in AI algorithms and route optimization.',
      image: yash,
      github: '#',
      linkedin: '#',
      email: 'yashgupta@gmail.com',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Active Users' },
    { value: '50+', label: 'Cities Covered' },
    { value: '500t', label: 'CO₂ Saved' },
    { value: '98%', label: 'Match Rate' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Banner */}
      <section className="section-dark relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-charcoal" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <RevealSection>
            <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-6">Our Story</p>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              We're building the <span className="text-gradient">future of travel</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              Kindlift was born from a simple idea: empty seats are a wasted resource. We're reshaping how India commutes — one shared ride at a time.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <RevealSection>
              <div>
                <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-6">Our Mission</p>
                <h2 className="font-display text-display-sm text-brand-dark mb-8">
                  Building a community of travelers
                </h2>
                <div className="space-y-6 text-brand-muted leading-relaxed">
                  <p>
                    In a world facing climate change and rising fuel costs, we built a platform that
                    brings people together while taking cars off the road.
                  </p>
                  <p>
                    By leveraging smart routing, real-time matching, and a unique coin-reward system,
                    we've transformed ride-sharing from a transaction into a community-driven movement.
                  </p>
                </div>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="relative">
                {/* Pull quote */}
                <div className="border-l-2 border-brand-accent pl-8 py-4">
                  <p className="font-display text-2xl md:text-3xl font-bold text-brand-dark leading-snug">
                    "Every empty seat is a missed connection. Every shared ride is a new friendship."
                  </p>
                  <p className="text-brand-muted mt-4 text-sm">— The Kindlift Team</p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-dark py-20 md:py-28 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-display text-5xl md:text-6xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 mt-3 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Team */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="mb-20">
              <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">The Team</p>
              <h2 className="font-display text-display-md text-brand-dark">Meet the builders</h2>
            </div>
          </RevealSection>

          <div className="space-y-0 border-t border-brand-gray-light">
            {developers.map((dev, i) => (
              <RevealSection key={i}>
                <div className="group flex flex-col md:flex-row items-start gap-8 md:gap-12 py-10 md:py-14 border-b border-brand-gray-light">
                  {/* Image */}
                  <div className="w-full md:w-48 h-64 md:h-48 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-2 group-hover:text-brand-accent transition-colors duration-300">
                          {dev.name}
                        </h3>
                        <p className="text-brand-accent text-sm font-display font-semibold">{dev.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <a href={dev.github} className="w-10 h-10 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:bg-brand-dark/10 transition-all">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={dev.linkedin} className="w-10 h-10 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:bg-brand-dark/10 transition-all">
                          <Link2 className="h-4 w-4" />
                        </a>
                        <a href={`mailto:${dev.email}`} className="w-10 h-10 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:bg-brand-dark/10 transition-all">
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    <p className="text-brand-muted mt-4 leading-relaxed max-w-lg">{dev.description}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};