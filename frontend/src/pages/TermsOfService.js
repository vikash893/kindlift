import React from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { FileText, Users, Car, Coins, AlertTriangle, Scale, Ban } from 'lucide-react';

export const TermsOfService = () => {
  const sections = [
    {
      icon: <Users className="h-5 w-5" />,
      title: '1. Account & Eligibility',
      content: [
        'You must be at least 18 years old to create an account and use Kindlift services.',
        'You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.',
        'All information provided during registration must be accurate, current, and complete. Misrepresentation may result in account termination.',
        'One person may only maintain one active Kindlift account. Duplicate accounts will be suspended.',
      ],
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: '2. Ride-Sharing Rules',
      content: [
        'Drivers must possess a valid driving license, vehicle registration, and insurance as required by Indian motor vehicle laws.',
        'Riders and drivers agree to treat each other with respect and courtesy throughout the journey.',
        'Drivers set their own prices and routes. Kindlift acts as a facilitator, not a transportation provider.',
        'Both parties must be at the agreed pickup location on time. No-shows may be subject to penalties or reduced ratings.',
      ],
    },
    {
      icon: <Coins className="h-5 w-5" />,
      title: '3. Payments & Kindlift Coins',
      content: [
        'Kindlift coins are earned through ride completions, referrals, and community participation. They can be redeemed for ride credits.',
        'All monetary transactions are processed through secure third-party payment gateways.',
        'Cancellation fees may apply depending on how close to the ride time a cancellation is made.',
        'Kindlift reserves the right to modify the coin reward structure with prior notice to users.',
      ],
    },
    {
      icon: <Ban className="h-5 w-5" />,
      title: '4. Prohibited Activities',
      content: [
        'Using the platform for any illegal purpose, including transporting prohibited goods or substances.',
        'Harassing, threatening, or behaving inappropriately towards other users of the platform.',
        'Attempting to manipulate ratings, reviews, or the coin-reward system through fraudulent activity.',
        'Sharing or selling account access, or creating automated/bot accounts to abuse platform features.',
      ],
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: '5. Limitation of Liability',
      content: [
        'Kindlift is a ride-sharing platform that connects users. We are not a transportation carrier and do not guarantee ride availability.',
        'We are not liable for any direct, indirect, or consequential damages arising from use of the platform or rides taken.',
        'Users travel at their own risk. We encourage all users to follow our safety guidelines and report any concerns immediately.',
        'Kindlift may suspend or terminate accounts that violate these terms without prior notice.',
      ],
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: '6. Dispute Resolution',
      content: [
        'Any disputes between users should first be reported through the in-app support system for mediation.',
        'Kindlift will make reasonable efforts to resolve disputes fairly, but final decisions rest with our moderation team.',
        'These terms are governed by the laws of India. Any unresolved legal disputes shall be subject to the jurisdiction of courts in India.',
        'We reserve the right to update these terms. Continued use of the platform after changes constitutes acceptance.',
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
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest">Terms of Service</p>
            </div>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Rules of the <span className="text-gradient">road</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              By using Kindlift, you agree to these terms. Please read them carefully — they protect both you and our community.
            </p>
            <p className="text-white/30 text-sm mt-6">Effective: April 2026</p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};
