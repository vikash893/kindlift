import React from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { Shield, Eye, Database, Lock, UserCheck, Globe, Mail } from 'lucide-react';

export const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: 'Information We Collect',
      content: [
        'Personal details such as your name, email address, phone number, and profile photo when you create an account.',
        'Ride information including pickup/drop-off locations, travel dates, and route preferences.',
        'Device information such as IP address, browser type, and operating system for security and analytics.',
        'Usage data including interactions with the platform, ride history, and communication logs.',
      ],
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: 'How We Use Your Information',
      content: [
        'To match riders with drivers and facilitate ride-sharing connections across India.',
        'To process payments, manage Kindlift coins, and handle ride transactions securely.',
        'To improve our platform through analytics, feature development, and user experience optimization.',
        'To communicate service updates, ride confirmations, safety alerts, and promotional offers (with your consent).',
      ],
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'Data Security',
      content: [
        'We use industry-standard encryption (SSL/TLS) to protect data in transit and at rest.',
        'Access to personal data is restricted to authorized personnel on a need-to-know basis.',
        'Regular security audits and vulnerability assessments are conducted to maintain data integrity.',
        'We never store full payment card details on our servers — all payment processing is handled by certified third-party providers.',
      ],
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: 'Your Rights',
      content: [
        'Access: You can request a copy of all personal data we hold about you at any time.',
        'Correction: You may update or correct inaccurate personal information through your profile settings.',
        'Deletion: You can request deletion of your account and associated data, subject to legal retention requirements.',
        'Portability: You can request your data in a machine-readable format for transfer to another service.',
      ],
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Cookies & Tracking',
      content: [
        'We use essential cookies to maintain your session and ensure platform functionality.',
        'Analytics cookies help us understand how users interact with Kindlift to improve the experience.',
        'You can manage cookie preferences through your browser settings at any time.',
        'We do not sell your personal data to third-party advertisers.',
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-accent">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest">Privacy Policy</p>
            </div>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Your privacy is <span className="text-gradient">our priority</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              We believe in transparency. Here's exactly how we collect, use, and protect your personal information.
            </p>
            <p className="text-white/30 text-sm mt-6">Last updated: April 2026</p>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {sections.map((section, i) => (
            <RevealSection key={i}>
              <div className={`py-12 ${i !== sections.length - 1 ? 'border-b border-brand-gray-light' : ''}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent flex-shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark">{section.title}</h2>
                </div>
                <ul className="space-y-4 ml-14">
                  {section.content.map((item, j) => (
                    <li key={j} className="text-brand-muted leading-relaxed flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          ))}

          {/* Contact */}
          <RevealSection>
            <div className="mt-16 p-8 md:p-12 rounded-3xl bg-brand-dark text-white">
              <div className="flex items-start gap-4 mb-6">
                <Mail className="h-6 w-6 text-brand-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Questions about your privacy?</h3>
                  <p className="text-white/50 leading-relaxed">
                    If you have any questions or concerns about this privacy policy or your data, please contact us at{' '}
                    <a href="mailto:rajputvishnu2513@gmail.com" className="text-brand-accent hover:underline">
                      rajputvishnu2513@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
