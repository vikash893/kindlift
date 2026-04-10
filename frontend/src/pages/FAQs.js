import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div
    className="border-b border-brand-gray-light last:border-none group cursor-pointer"
    onClick={onClick}
  >
    <button
      className="w-full flex items-center justify-between py-7 text-left"
      aria-expanded={isOpen}
    >
      <span className={`font-display text-lg md:text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-brand-accent' : 'text-brand-dark group-hover:text-brand-accent'}`}>
        {question}
      </span>
      <ChevronDown
        className={`h-5 w-5 flex-shrink-0 ml-4 text-brand-muted transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-brand-accent' : ''}`}
      />
    </button>
    <div
      className="overflow-hidden transition-all duration-500 ease-out"
      style={{
        maxHeight: isOpen ? '500px' : '0px',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <p className="text-brand-muted leading-relaxed pb-7 pr-12">{answer}</p>
    </div>
  </div>
);

export const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    {
      name: 'Getting Started',
      faqs: [
        {
          question: 'What is Kindlift?',
          answer: 'Kindlift is a community-driven ride-sharing platform connecting riders and drivers across India. We help you find and share rides affordably, reducing travel costs and your carbon footprint while meeting new people.',
        },
        {
          question: 'How do I create an account?',
          answer: 'Tap "Get Started" on the homepage and enter your name, email, and phone number. We\'ll send a one-time OTP to verify your phone. Once verified, you can immediately start offering or booking rides.',
        },
        {
          question: 'Is Kindlift free to use?',
          answer: 'Yes! Creating an account, searching for rides, and offering rides is completely free. Riders pay a cost-sharing amount directly to the driver, which is agreed upon before the ride. Kindlift does not charge any commission.',
        },
      ],
    },
    {
      name: 'Rides & Booking',
      faqs: [
        {
          question: 'How do I find a ride?',
          answer: 'Go to "Find Ride" and enter your origin, destination, and travel date. Kindlift will display matching rides sorted by relevance. You can filter by departure time, available seats, and price range.',
        },
        {
          question: 'How do I offer a ride?',
          answer: 'Navigate to "Offer Ride" from your dashboard. Enter your route details, departure time, available seats, and the cost per seat. Your ride will be listed instantly for other users to find and book.',
        },
        {
          question: 'Can I cancel a ride?',
          answer: 'Yes, both riders and drivers can cancel rides. However, we encourage cancelling as early as possible to avoid inconveniencing others. Frequent cancellations may affect your community rating.',
        },
        {
          question: 'What payment methods are supported?',
          answer: 'Kindlift currently facilitates cost-sharing through direct payment between riders and drivers (cash, UPI, or any mutually agreed method). We do not process payments through the platform at this time.',
        },
      ],
    },
    {
      name: 'KindCoins',
      faqs: [
        {
          question: 'What are KindCoins?',
          answer: 'KindCoins are our virtual reward currency. You earn them by offering rides, completing trips, and contributing positively to the community. They represent your contribution to a greener, more connected India.',
        },
        {
          question: 'How do I earn KindCoins?',
          answer: 'You earn KindCoins for every completed ride you offer (10 coins), for each booking completed as a rider (5 coins), for maintaining a high rating (bonus coins monthly), and for referring new users to the platform.',
        },
        {
          question: 'Can I redeem KindCoins for money?',
          answer: 'KindCoins are currently a gamified reward and cannot be redeemed for cash. They showcase your contribution to the community. We\'re exploring future partnerships for exciting redemption options — stay tuned!',
        },
      ],
    },
    {
      name: 'Safety & Trust',
      faqs: [
        {
          question: 'How do you verify users?',
          answer: 'Every user must verify their phone number via OTP during registration. We also encourage profile completion with a real photo and bio. Our community rating system further helps identify trustworthy users.',
        },
        {
          question: 'What if I feel unsafe during a ride?',
          answer: 'Your safety is our top priority. Use the in-app SOS feature to alert your emergency contacts with your live location. If in immediate danger, call 112 first. After the ride, report the incident through the app.',
        },
        {
          question: 'How does the rating system work?',
          answer: 'After each ride, both riders and drivers can rate each other on a 5-star scale. Ratings are averaged over time. Users with consistently low ratings are flagged for review and may be removed from the platform.',
        },
      ],
    },
  ];

  // Flatten all FAQs for the accordion index
  const allFaqs = categories.flatMap((cat) => cat.faqs);
  let globalIndex = 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="section-dark relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-charcoal" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <RevealSection>
            <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-6">Support</p>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Frequently asked <span className="text-gradient">questions</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              Everything you need to know about Kindlift. Can't find an answer? Reach out to us.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {categories.map((category, catIdx) => {
            const startIdx = globalIndex;
            const categoryFaqs = category.faqs.map((faq, i) => {
              const idx = globalIndex++;
              return (
                <FAQItem
                  key={idx}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === idx}
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                />
              );
            });

            return (
              <RevealSection key={catIdx}>
                <div className={catIdx > 0 ? 'mt-16' : ''}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-brand-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-brand-dark">{category.name}</h2>
                  </div>
                  <div className="border-t border-brand-gray-light rounded-2xl">
                    {categoryFaqs}
                  </div>
                </div>
              </RevealSection>
            );
          })}

          <RevealSection>
            <div className="mt-20 p-12 md:p-16 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-charcoal text-center">
              <HelpCircle className="h-10 w-10 text-brand-accent mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                We're here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold text-lg rounded-full hover:bg-white transition-all duration-500"
              >
                Contact Support
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
