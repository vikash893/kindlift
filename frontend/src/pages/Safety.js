import React from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { Shield, Phone, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export const Safety = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Every user is verified via phone OTP. We validate identity before any ride can be offered or booked, ensuring you always know who you\'re riding with.',
    },
    {
      icon: MapPin,
      title: 'Real-Time Location Sharing',
      description: 'Share your live ride location with trusted contacts. They can follow your journey in real-time and receive notifications when you arrive safely.',
    },
    {
      icon: Phone,
      title: 'Emergency SOS',
      description: 'Our in-app SOS button instantly alerts your emergency contacts and shares your exact GPS location. Help is always one tap away.',
    },
    {
      icon: Users,
      title: 'Community Ratings',
      description: 'Our two-way rating system lets both riders and drivers rate each other. Users with consistently low ratings are flagged for review or removed from the platform.',
    },
    {
      icon: AlertCircle,
      title: 'Report & Block',
      description: 'Encountered suspicious behavior? Instantly report a user or block them. Our trust & safety team reviews every report within 24 hours.',
    },
    {
      icon: CheckCircle,
      title: 'Ride Insurance',
      description: 'All rides facilitated through Kindlift are covered by a basic ride-protection policy. Details about coverage limits and claims are available in your ride summary.',
    },
  ];

  const tips = [
    {
      title: 'Before the Ride',
      items: [
        'Verify the driver\'s name, photo, and vehicle details before getting in.',
        'Share your ride details — origin, destination, and ETA — with a trusted friend or family member.',
        'Prefer meeting at well-lit, public pick-up points.',
        'Trust your instincts — if something feels off, cancel the ride.',
      ],
    },
    {
      title: 'During the Ride',
      items: [
        'Keep your phone charged and location services enabled.',
        'Sit in the back seat when riding with someone you don\'t know well.',
        'Follow the route on the map — flag any unexpected detours.',
        'Stay alert and limit personal information shared with co-riders.',
      ],
    },
    {
      title: 'After the Ride',
      items: [
        'Rate your experience honestly — it helps the community.',
        'Report any issues through the app immediately.',
        'Check for personal belongings before exiting the vehicle.',
        'Leave constructive feedback to help improve the platform.',
      ],
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="section-dark relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-charcoal" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <RevealSection>
            <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-6">Trust & Safety</p>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Your safety is <span className="text-gradient">our priority</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              We've built multiple layers of protection so you can ride with confidence.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Safety Features Grid */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="mb-20">
              <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Built-in Protection</p>
              <h2 className="font-display text-display-md text-brand-dark">Safety features</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <RevealSection key={i}>
                  <div className="group p-8 rounded-3xl border border-brand-gray-light hover:border-brand-accent/30 hover:shadow-lg transition-all duration-500 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-brand-dark/5 flex items-center justify-center mb-6 group-hover:bg-brand-accent/10 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-brand-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                    <p className="text-brand-muted leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="mb-20">
              <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Stay Safe</p>
              <h2 className="font-display text-display-md text-white">Ride-sharing safety tips</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tips.map((tip, i) => (
              <RevealSection key={i}>
                <div className="p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="font-display text-5xl font-bold text-white/10">0{i + 1}</span>
                    <h3 className="font-display text-xl font-bold text-white">{tip.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {tip.items.map((item, j) => (
                      <li key={j} className="text-white/50 leading-relaxed flex items-start gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact CTA */}
      <section className="section-light py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <RevealSection>
            <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-charcoal text-white">
              <Phone className="h-10 w-10 text-brand-accent mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Need immediate help?</h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                If you're in danger, always call local emergency services first. Then report through the app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:112"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-display font-bold text-lg rounded-full hover:bg-red-500 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  Call 112
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-display font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
