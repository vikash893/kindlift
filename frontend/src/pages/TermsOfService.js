import React from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { FileText, Scale, XCircle, AlertTriangle, RefreshCw, Gavel } from 'lucide-react';

export const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content:
        'By accessing and using Kindlift, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our platform. We reserve the right to update or modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.',
    },
    {
      icon: Scale,
      title: '2. User Responsibilities',
      content:
        'You agree to provide accurate and truthful information during registration and while using the platform. As a rider, you agree to show up on time and treat drivers with respect. As a driver, you agree to maintain a valid driving license, valid vehicle insurance, and adhere to all applicable traffic and road-safety laws. Any form of harassment, discrimination, or misconduct is strictly prohibited and may result in immediate account termination.',
    },
    {
      icon: AlertTriangle,
      title: '3. Ride-Sharing Disclaimer',
      content:
        'Kindlift is a peer-to-peer matching platform. We do not operate as a transportation carrier, taxi service, or professional ride-hailing company. We facilitate connections between riders and drivers, but we do not guarantee the availability, quality, or safety of any specific ride. Users participate in ride-sharing at their own risk. Kindlift is not liable for any incidents, accidents, delays, or losses that occur during a ride.',
    },
    {
      icon: RefreshCw,
      title: '4. KindCoins & Rewards',
      content:
        'KindCoins are a non-monetary virtual reward system used within the Kindlift platform. KindCoins have no cash value and cannot be exchanged, transferred, or redeemed for real-world currency. Kindlift reserves the right to modify, suspend, or discontinue the KindCoins system at any time without prior notice. Abuse of the reward system, including creating fake rides to farm KindCoins, will result in account suspension or permanent ban.',
    },
    {
      icon: XCircle,
      title: '5. Prohibited Activities',
      list: [
        'Using the platform for commercial transportation or unauthorized profit.',
        'Creating multiple accounts or impersonating another person.',
        'Posting false, misleading, or fraudulent ride listings.',
        'Attempting to circumvent security measures or exploit platform vulnerabilities.',
        'Engaging in any activity that violates applicable local, national, or international laws.',
        'Sharing or distributing other users\' personal information without their consent.',
      ],
    },
    {
      icon: Gavel,
      title: '6. Limitation of Liability',
      content:
        'To the fullest extent permitted by law, Kindlift and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform. Our total liability for any claim arising out of or relating to these terms or the platform shall not exceed the amount you have paid to Kindlift, if any, in the twelve (12) months preceding the claim.',
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
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              Please read these terms carefully before using Kindlift.
            </p>
            <p className="text-white/30 text-sm mt-4">Effective: April 2026</p>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
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
                    <div className="pl-16">
                      {section.content && (
                        <p className="text-brand-muted leading-relaxed">{section.content}</p>
                      )}
                      {section.list && (
                        <ul className="space-y-3">
                          {section.list.map((item, j) => (
                            <li key={j} className="text-brand-muted leading-relaxed flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>

          <RevealSection>
            <div className="mt-20 pt-12 border-t border-brand-gray-light">
              <p className="text-brand-muted leading-relaxed">
                For questions about these Terms of Service, contact us at{' '}
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
