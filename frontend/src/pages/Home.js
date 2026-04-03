import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Map, Shield, Coins, Star, Users,
  Compass, Heart, Clock, Route, UserPlus,
  MessageCircle, ThumbsUp, Sparkles, Battery,
  Sun, Moon, Coffee, Camera, Music, Gift
} from 'lucide-react';
import car_vedio from '../public/car_vedio.mp4';

export const Home = () => {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section - Now clearly states the "lonely drive" problem */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden hero-section">
        <div className="absolute inset-0 bg-black opacity-30 patterned-bg"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🚗</div>
          <div className="absolute bottom-20 right-10 text-8xl opacity-10 animate-float-delayed">🛣️</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-5 animate-pulse">✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="text-center">
            {/* Problem Statement - Makes user feel understood */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-yellow-300">🚗💨</span>
              <span className="text-sm font-medium">Long drive ahead? Feeling lonely?</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-in">
              Don't Drive Alone.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Find Your Ride Buddy
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-xl text-blue-100 mx-auto mb-8 animate-fade-in-delayed leading-relaxed">
              You're planning a long journey, but driving solo feels empty and expensive.
              We connect you with fellow travelers heading the same way — share costs,
              share stories, and turn a lonely drive into an unforgettable road trip.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-bounce-in">
              <Link
                to="/find-companion"
                className="px-8 py-4 border border-transparent text-lg font-bold rounded-full text-slate-900 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-xl transition-all transform hover:-translate-y-1"
              >
                🎯 Find a Travel Companion
              </Link>
              <Link
                to="/offer-ride"
                className="px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white hover:bg-white hover:text-slate-900 shadow-xl transition-all transform hover:-translate-y-1 backdrop-blur-sm"
              >
                🙋 I'm Driving — Need Company
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1">✅ 10,000+ Happy Journeys</span>
              <span className="flex items-center gap-1">✅ 98% Match Accuracy</span>
              <span className="flex items-center gap-1">✅ Active in 50+ Cities</span>
            </div>
          </div>
        </div>

        {/* Animated Car driving across */}
        <div className="car-container">
          <div className="car">
            <span className="text-6xl">🚙💨</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Video Background */}
  <div className="relative text-white overflow-hidden hero-section min-h-screen py-12 px-6">
        {/* Video Background */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl" style={{ margin: '0 auto', maxWidth: 'calc(100% - 1000px)', height: 'calc(100vh - 500px)' }}></div>
        <div className="absolute inset-0 w-full h-full">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.pexels.com/photos/road-trip-xxx.jpg" // optional thumbnail
          >
            <source
              src={car_vedio}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Rest of your hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* ... your existing hero content ... */}
        </div>
      </div>

      {/* How It Works - Simple 3-step process */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-2 mb-4">
              Find Your Ride Buddy in 3 Easy Steps
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're driving or looking for a seat, we make it effortless to connect with fellow travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Route className="h-12 w-12 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">Step 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Plan Your Journey</h3>
              <p className="text-gray-600">Enter your starting point, destination, and travel date. Tell us if you're driving or need a ride.</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-12 w-12 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">Step 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Matched</h3>
              <p className="text-gray-600">Our smart algorithm finds travelers going your way. Browse profiles and preferences.</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
              <div className="text-2xl font-bold text-pink-600 mb-2">Step 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Travel</h3>
              <p className="text-gray-600">Chat with your match, coordinate details, and hit the road together!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem vs Solution Section - Clearly explains the value */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              From Lonely Drive to <span className="text-blue-600">Memorable Journey</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem Column */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😔</span>
                </div>
                <h3 className="text-2xl font-bold text-red-800">The Solo Drive Struggle</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Boring 5-hour drive with no one to talk to",
                  "Full fuel cost on just one person",
                  "No one to share snacks, music, or stories with",
                  "Feeling unsafe driving alone at night",
                  "No help if your car breaks down",
                  "Arriving tired and lonely at your destination"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-500 mt-1">❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Column */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800">With Kindlift</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Interesting conversations and new friendships",
                  "Split fuel costs — save up to 50%",
                  "Curate the perfect road trip playlist together",
                  "Safety in numbers during night drives",
                  "Shared responsibility and peace of mind",
                  "Arrive energized with new memories and friends"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 mt-1">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Detailed benefits */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Why Travelers Love Kindlift
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've thought of everything to make your shared journey safe, enjoyable, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Route Matching</h3>
              <p className="text-gray-600 mb-3">Our AI finds travelers within 5km of your route, not just exact destinations. Perfect for long highway journeys!</p>
              <div className="text-sm text-blue-600 font-medium">✨ 95% match accuracy</div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Companion Preferences</h3>
              <p className="text-gray-600 mb-3">Choose your ideal travel buddy — conversation level, music taste, smoking preference, pet-friendly, and more.</p>
              <div className="text-sm text-green-600 font-medium">🎯 Find your vibe</div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600 mb-3">Verified IDs, driver's license check, vehicle verification, and an emergency SOS button on every journey.</p>
              <div className="text-sm text-purple-600 font-medium">🛡️ 100% verified users</div>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Coins className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kindlift Coins</h3>
              <p className="text-gray-600 mb-3">Earn coins on every trip! Redeem for free rides, discounts, or donate to charity. The more you share, the more you earn.</p>
              <div className="text-sm text-amber-600 font-medium">💰 10 coins = 1 free km</div>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-cyan-50 to-sky-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-cyan-100">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Ratings</h3>
              <p className="text-gray-600 mb-3">Two-way rating system after each journey. Build your reputation as a great driver or passenger.</p>
              <div className="text-sm text-cyan-600 font-medium">⭐ 4.92 average rating</div>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-rose-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-rose-100">
              <div className="w-14 h-14 bg-rose-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gift className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Referral Rewards</h3>
              <p className="text-gray-600 mb-3">Invite friends and get 50 bonus coins each. Build your travel network and earn together!</p>
              <div className="text-sm text-rose-600 font-medium">🎁 Unlimited referrals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials - Real stories */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Real Stories from the Road
            </h2>
            <p className="text-xl text-gray-600">See how Kindlift turned lonely drives into lifelong friendships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                from: "Mumbai → Pune",
                quote: "I used to dread the 3-hour drive to Pune alone. Now I actually look forward to it! Found a regular travel buddy who loves the same podcasts as me.",
                rating: 5,
                avatar: "👩‍💼"
              },
              {
                name: "Rahul Verma",
                from: "Delhi → Jaipur",
                quote: "Split fuel costs, great conversation, and even made a business connection. Kindlift is a game-changer for solo travelers.",
                rating: 5,
                avatar: "👨‍💻"
              },
              {
                name: "Anjali Nair",
                from: "Bangalore → Coorg",
                quote: "Was nervous about sharing a ride at first. But the verification system is solid, and now I've made 3 good friends through Kindlift trips!",
                rating: 5,
                avatar: "👩‍🎨"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.from}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Tips for a Great Shared Journey
            </h2>
            <p className="text-xl text-gray-600">Make every ride comfortable and memorable</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "💬", title: "Chat First", desc: "Discuss expectations before meeting" },
              { icon: "📍", title: "Share Location", desc: "Share live location for pickup" },
              { icon: "🎵", title: "Music Queue", desc: "Take turns with the AUX" },
              { icon: "🍎", title: "Snacks Share", desc: "Bring extra to share!" }
            ].map((tip, i) => (
              <div key={i} className="text-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className="text-4xl mb-3">{tip.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Turn Your Next Drive Into an Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the joy of shared journeys.
            Your next road trip friend is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-companion" className="px-8 py-4 bg-yellow-400 text-slate-900 font-bold rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl text-lg">
              🚀 Find My Travel Companion
            </Link>
            <Link to="/offer-ride" className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-700 transition-all text-lg">
              🙋 I Want to Offer a Ride
            </Link>
          </div>
          <p className="mt-8 text-sm text-blue-200">
            Free to join • No commitment • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};