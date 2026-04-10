import React from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { Shield, Eye, Lock, Database, Cookie, UserCheck } from 'lucide-react';

export const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal identification information (name, email address, phone number) provided during registration.',
        'Location data when you search for or offer rides, used solely for route matching.',
        'Device and browser information for security and performance optimization.',
        'Usage data such as ride history, search patterns, and interaction analytics to improve our services.',
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To match riders with drivers and facilitate ride-sharing connections.',
        'To verify user identity through OTP and maintain platform security.',
        'To send transactional notifications about your rides and account activity.',
        'To improve our algorithms, user experience, and overall service quality.',
      ],
    },
    {
      icon: Lock,
      title: 'Data Protection & Security',
      content: [
        'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
        'Passwords are hashed using bcrypt with salting to prevent unauthorized access.',
        'We conduct regular security audits and vulnerability assessments.',
        'Access to personal data is restricted to authorized personnel on a need-to-know basis.',
      ],
    },
    {
      icon: UserCheck,
      title: 'Third-Party Sharing',
      content: [
        'We do not sell your personal information to third parties under any circumstances.',
        'Limited data may be shared with ride partners solely to facilitate the ride you booked.',
        'We may share anonymized, aggregated data for research and analytics purposes.',
        'Law enforcement requests are honored only when legally required and properly documented.',
      ],
    },
    {
      icon: Cookie,
      title: 'Cookies & Tracking',
      content: [
        'We use essential cookies to maintain your session and remember your preferences.',
        'Analytics cookies help us understand how users interact with Kindlift.',
        'You can manage cookie preferences through your browser settings at any time.',
        'We do not use third-party advertising trackers on our platform.',
      ],
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'You can request access to all personal data we hold about you at any time.',
        'You may request correction or deletion of your personal information.',
        'You can opt out of non-essential communications via your account settings.',
        'You have the right to data portability — export your data in a standard format.',
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
            <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-6">Legal</p>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              Your privacy matters to us. Here's how we collect, use, and protect your data.
            </p>
            <p className="text-white/30 text-sm mt-4">Last updated: April 2026</p>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="mb-16">
              <p className="text-brand-muted leading-relaxed text-lg">
                At Kindlift, we are committed to protecting your personal information and your right to privacy.
                This Privacy Policy explains what information we collect, how we use it, and what rights you have
                in relation to it. By using our platform, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </div>
          </RevealSection>

          <div className="space-y-16">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <RevealSection key={i}>
                  <div className="group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-dark/5 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors duration-300">
                        <Icon className="h-5 w-5 text-brand-accent" />
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-4 pl-16">
                      {section.content.map((item, j) => (
                        <li key={j} className="text-brand-muted leading-relaxed flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealSection>
              );
            })}
          </div>

          <RevealSection>
            <div className="mt-20 pt-12 border-t border-brand-gray-light">
              <p className="text-brand-muted leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:rajputvishnu2513@gmail.com" className="text-brand-accent link-hover font-medium">
                  rajputvishnu2513@gmail.com
                </a>.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
