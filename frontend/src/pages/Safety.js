import React from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { ShieldCheck, Phone, MapPin, Star, AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';

export const Safety = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Verified Profiles',
      description: 'Every user goes through identity verification. Government ID, phone number, and email are verified before first ride.',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Live Ride Tracking',
      description: 'Share your live location with trusted contacts during any ride. Real-time GPS tracking for complete peace of mind.',
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Emergency SOS',
      description: 'One-tap emergency button connects you instantly to local authorities and shares your live location with your emergency contacts.',
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Rating System',
      description: 'Two-way ratings after every ride keep our community accountable. Users below threshold ratings are reviewed by our safety team.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Moderation',
      description: 'Our dedicated safety team reviews reports 24/7. Inappropriate behavior leads to immediate account suspension.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for any safety concern. Our team is trained to handle emergency situations swiftly.',
    },
  ];

  const tips = [
    'Always verify the driver\'s name, photo, and vehicle details before getting in.',
    'Share your ride details and live location with a trusted friend or family member.',
    'Sit in the back seat when riding alone for an easy exit if needed.',
    'Trust your instincts — if something feels off, cancel the ride.',
    'Keep your personal belongings secure and never share sensitive personal information.',
    'Report any suspicious behavior immediately through the app\'s safety center.',
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="section-dark relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-charcoal" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <RevealSection>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-accent">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest">Safety</p>
            </div>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Your safety comes <span className="text-gradient">first</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              We've built multiple layers of protection so every ride feels secure. Here's how Kindlift keeps you safe.
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
            {features.map((feature, i) => (
              <RevealSection key={i}>
                <div className="group p-8 rounded-3xl border border-brand-gray-light hover:border-brand-accent/30 transition-all duration-500 card-lift">
                  <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                  <p className="text-brand-muted leading-relaxed text-sm">{feature.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="mb-16">
              <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Stay Smart</p>
              <h2 className="font-display text-display-md text-white">Safety tips for riders</h2>
            </div>
          </RevealSection>

          <div className="space-y-0 border-t border-white/10">
            {tips.map((tip, i) => (
              <RevealSection key={i}>
                <div className="flex items-start gap-5 py-6 border-b border-white/10 group">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-accent/30 transition-colors">
                    <CheckCircle className="h-4 w-4 text-brand-accent" />
                  </div>
                  <p className="text-white/70 leading-relaxed group-hover:text-white transition-colors duration-300">{tip}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="section-light py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 md:p-12 rounded-3xl bg-red-50 border border-red-100">
              <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center text-white flex-shrink-0">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-brand-dark mb-2">In case of emergency</h3>
                <p className="text-brand-muted leading-relaxed">
                  If you ever feel unsafe during a ride, use the in-app SOS button or call emergency services at <strong className="text-brand-dark">112</strong>.
                  You can also reach our 24/7 safety team at <strong className="text-brand-dark">+91 78775 87073</strong>.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
