import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealSection } from './TextReveal';

export const Footer = () => {
  return (
    <footer className="section-dark relative overflow-hidden">
      {/* Giant CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-32">
          <RevealSection>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <h2 className="font-display text-display-lg text-white max-w-3xl">
                Ready to share <br />
                <span className="text-gradient">your next ride?</span>
              </h2>
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold text-lg rounded-full hover:bg-white transition-all duration-500"
              >
                Get Started
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </RevealSection>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <RevealSection>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-white">Kindlift</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Connecting travelers across India. Share rides, save costs, make lifelong friendships, and reduce your carbon footprint.
              </p>
            </RevealSection>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <RevealSection>
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest mb-6">Navigate</h4>
              <ul className="space-y-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/book-ride', label: 'Find Ride' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-white/50 text-sm hover:text-white link-hover transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealSection>
          </div>

          <div className="md:col-span-2">
            <RevealSection>
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Safety', 'FAQs'].map((item) => (
                  <li key={item}>
                    <span className="text-white/50 text-sm hover:text-white link-hover transition-colors duration-300 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealSection>
          </div>

          <div className="md:col-span-3">
            <RevealSection>
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest mb-6">
                Contact
              </h4>

              <ul className="space-y-5 text-sm">

                {/* Emails */}
                <li>
                  <p className="text-white/80 font-medium mb-1">Emails</p>
                  <div className="flex flex-col gap-1 text-white/50">
                    <span>rajputvishnu2513@gmail.com</span>
                    <span>vikash.h24@gla.ac.in</span>
                    <span>yash.gupta_cs.h24@gla.ac.in</span>
                  </div>
                </li>

                {/* Phone Numbers */}
                <li>
                  <p className="text-white/80 font-medium mb-1">Phone</p>
                  <div className="flex flex-col gap-1 text-white/50">
                    <span>+91 7906990603</span>
                    <span>+91 7015283332</span>
                    <span>+91 7877587073</span>
                  </div>
                </li>

                {/* Location */}
                <li>
                  <p className="text-white/80 font-medium mb-1">Location</p>
                  <span className="text-white/50">India</span>
                </li>

              </ul>
            </RevealSection>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} Kindlift. All rights reserved.</p>
          <p className="text-white/30 text-sm">Designed with intention.</p>
        </div>
      </div>
    </footer>
  );
};
