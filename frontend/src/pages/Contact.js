import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions or need support? Our team is always here to help you get moving.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Contact Info */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-10 lg:w-1/3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/50 p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <span>support@kindlift.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/50 p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/50 p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <span>123 Mobility Avenue, Tech Hub, CA 94016</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-10 lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" required className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" required className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" required className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows="4" required className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"></textarea>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center">
              {sent ? 'Message Sent!' : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
