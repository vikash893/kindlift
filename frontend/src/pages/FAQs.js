import React, { useState } from 'react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import { HelpCircle, ChevronDown, Search, Car, CreditCard, Shield, Users, Coins } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-brand-gray-light">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-6 text-left group"
    >
      <span className={`font-display font-semibold text-lg transition-colors duration-300 ${isOpen ? 'text-brand-accent' : 'text-brand-dark group-hover:text-brand-accent'}`}>
        {question}
      </span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'bg-brand-accent text-white rotate-180' : 'bg-brand-dark/5 text-brand-dark/40'}`}>
        <ChevronDown className="h-4 w-4" />
      </div>
    </button>
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
    >
      <p className="text-brand-muted leading-relaxed pr-12">{answer}</p>
    </div>
  </div>
);

export const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'General', icon: <HelpCircle className="h-4 w-4" /> },
    { name: 'Rides', icon: <Car className="h-4 w-4" /> },
    { name: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
    { name: 'Safety', icon: <Shield className="h-4 w-4" /> },
    { name: 'Account', icon: <Users className="h-4 w-4" /> },
    { name: 'Coins', icon: <Coins className="h-4 w-4" /> },
  ];

  const faqData = {
    General: [
      {
        question: 'What is Kindlift?',
        answer: 'Kindlift is a ride-sharing platform that connects travelers across India. Whether you\'re offering a ride or looking for one, Kindlift helps you find the perfect match — saving money, reducing emissions, and making new connections along the way.',
      },
      {
        question: 'How is Kindlift different from cab services?',
        answer: 'Unlike cab services, Kindlift connects regular people traveling on similar routes. Drivers share their existing trips, making it more affordable and eco-friendly. It\'s a community-driven platform, not a commercial taxi service.',
      },
      {
        question: 'Is Kindlift available in my city?',
        answer: 'Kindlift is rapidly expanding across India. We currently operate in 50+ cities and are growing every month. Check the app to see available rides in your area. If rides aren\'t available yet, sign up and be the first in your city!',
      },
      {
        question: 'Do I need to download an app?',
        answer: 'You can use Kindlift through our web platform on any device. We also offer native apps for Android and iOS for the best experience with features like push notifications and live tracking.',
      },
    ],
    Rides: [
      {
        question: 'How do I book a ride?',
        answer: 'Search for rides by entering your pickup and drop-off locations, select a travel date, and browse available rides. Once you find a match, send a booking request to the driver. You\'ll be notified once the driver accepts.',
      },
      {
        question: 'How do I offer a ride?',
        answer: 'Log in to your account, go to "Offer a Ride," enter your route details (origin, destination, date, time, available seats, and price per seat), and publish your ride. Riders looking for similar routes will be able to find and book your ride.',
      },
      {
        question: 'Can I cancel a booked ride?',
        answer: 'Yes, you can cancel a ride. However, cancellations made less than 2 hours before the scheduled departure may incur a small cancellation fee. We encourage early cancellations to give the other party time to make alternative arrangements.',
      },
      {
        question: 'What if the driver doesn\'t show up?',
        answer: 'If a driver doesn\'t show up, you\'ll receive a full refund and the driver\'s rating will be affected. You can also report the no-show through our support system and we\'ll follow up on it.',
      },
    ],
    Payments: [
      {
        question: 'How do payments work?',
        answer: 'Payments are processed securely through our platform. When you book a ride, the amount is held and released to the driver after the ride is completed. We support UPI, debit/credit cards, and net banking.',
      },
      {
        question: 'Is there a service fee?',
        answer: 'Kindlift charges a small platform fee to maintain and improve the service. This is clearly shown during booking, so there are no hidden charges. The majority of the fare goes directly to the driver.',
      },
      {
        question: 'How do refunds work?',
        answer: 'Refunds for cancelled rides are processed within 3-5 business days to your original payment method. For cancellations within the free cancellation window, you receive a full refund. Late cancellations may be subject to partial deductions.',
      },
      {
        question: 'Can I pay in cash?',
        answer: 'Currently, all payments are processed digitally through the platform to ensure security and transparency for both riders and drivers. Cash payments are not supported.',
      },
    ],
    Safety: [
      {
        question: 'How does Kindlift ensure safety?',
        answer: 'We verify all users through government ID, phone, and email verification. We also offer live ride tracking, an SOS emergency button, community ratings, and 24/7 support. Our safety team reviews all reported issues.',
      },
      {
        question: 'Can I share my ride location with someone?',
        answer: 'Absolutely! You can share your live ride location with trusted contacts directly from the app. They\'ll be able to track your journey in real-time until you reach your destination.',
      },
      {
        question: 'What should I do if I feel unsafe?',
        answer: 'Use the in-app SOS button to immediately alert emergency services and your emergency contacts. You can also call 112 (India\'s emergency number). After the ride, report the incident through our safety center.',
      },
      {
        question: 'Are drivers verified?',
        answer: 'Yes. All drivers must provide a valid driving license, vehicle registration, and insurance documents. These are verified by our team before they can offer rides. Drivers are also rated by riders after each trip.',
      },
    ],
    Account: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Get Started" on our homepage and fill in your details — name, email, phone number, and a password. You\'ll receive a verification email/SMS to confirm your account. After verification, you can start booking or offering rides.',
      },
      {
        question: 'How do I verify my identity?',
        answer: 'Go to your profile settings and upload a government-issued photo ID (Aadhaar, PAN, Passport, or Driving License). Our team will verify it within 24 hours. Verified profiles receive a badge and access to all features.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes. Go to Profile → Settings → Delete Account. Your data will be permanently removed within 30 days as per our privacy policy. Any remaining Kindlift coins will be forfeited upon deletion.',
      },
      {
        question: 'I forgot my password. What do I do?',
        answer: 'Click "Forgot Password" on the login page, enter your registered email, and you\'ll receive a password reset link. The link expires in 24 hours. If you don\'t receive it, check your spam folder or contact support.',
      },
    ],
    Coins: [
      {
        question: 'What are Kindlift Coins?',
        answer: 'Kindlift Coins are our reward currency. You earn them by completing rides, referring friends, and being an active community member. Coins can be redeemed for ride credits, giving you discounts on future trips.',
      },
      {
        question: 'How do I earn coins?',
        answer: 'You earn coins by: completing rides as a driver or rider, referring new users who complete their first ride, maintaining a high rating, and participating in community events and challenges.',
      },
      {
        question: 'Do coins expire?',
        answer: 'Coins remain valid for 12 months from the date they were earned. We\'ll send you a reminder before any coins are about to expire so you can use them in time.',
      },
      {
        question: 'Can I transfer coins to another user?',
        answer: 'Currently, coins are non-transferable and tied to your account. However, we\'re working on a feature to allow coin gifting to friends and family in a future update.',
      },
    ],
  };

  const filteredFAQs = faqData[activeCategory].filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <HelpCircle className="h-6 w-6" />
              </div>
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest">FAQs</p>
            </div>
            <h1 className="font-display text-display-xl text-white max-w-4xl">
              Got <span className="text-gradient">questions?</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              Find answers to everything about Kindlift — from booking rides to earning coins.
            </p>
          </RevealSection>

          {/* Search Bar */}
          <RevealSection>
            <div className="relative mt-12 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                type="text"
                placeholder="Search for a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 outline-none focus:border-brand-accent/50 transition-colors duration-300"
              />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Category Tabs */}
          <RevealSection>
            <div className="flex flex-wrap gap-3 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setActiveCategory(cat.name); setOpenIndex(0); }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-semibold transition-all duration-300 ${
                    activeCategory === cat.name
                      ? 'bg-brand-dark text-white'
                      : 'bg-brand-dark/5 text-brand-dark/60 hover:bg-brand-dark/10 hover:text-brand-dark'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </RevealSection>

          {/* FAQ Accordion */}
          <div>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, i) => (
                <RevealSection key={`${activeCategory}-${i}`}>
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === i}
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  />
                </RevealSection>
              ))
            ) : (
              <RevealSection>
                <div className="text-center py-16">
                  <HelpCircle className="h-12 w-12 text-brand-dark/20 mx-auto mb-4" />
                  <p className="text-brand-muted text-lg">No questions match your search. Try a different keyword.</p>
                </div>
              </RevealSection>
            )}
          </div>

          {/* Still have questions */}
          <RevealSection>
            <div className="mt-20 p-8 md:p-12 rounded-3xl bg-brand-dark text-white text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Still have questions?</h3>
              <p className="text-white/50 leading-relaxed mb-8 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is always happy to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold rounded-full hover:bg-white transition-all duration-500"
              >
                Contact Support
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
