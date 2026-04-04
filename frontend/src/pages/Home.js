import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Map, Shield, Coins, Star, Users,
  Compass, Heart, Clock, Route, UserPlus,
  MessageCircle, ThumbsUp, Sparkles, Battery,
  Sun, Moon, Coffee, Camera, Music, Gift
} from 'lucide-react';
import car_video from '../public/car_vedio.mp4';

export const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [carPosition, setCarPosition] = useState(50);
  const roadRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Calculate car position based on mouse X relative to window width
      const position = (e.clientX / window.innerWidth) * 100;
      setCarPosition(Math.min(Math.max(position, 5), 95)); // Limit to 5-95% to keep car on road
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Features data for staggered animations
  const features = [
    {
      icon: <Compass className="h-7 w-7 text-white" />,
      title: "Smart Route Matching",
      description: "Our AI finds travelers within 5km of your route, not just exact destinations. Perfect for long highway journeys!",
      badge: "✨ 95% match accuracy",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      delay: 0
    },
    {
      icon: <Heart className="h-7 w-7 text-white" />,
      title: "Companion Preferences",
      description: "Choose your ideal travel buddy — conversation level, music taste, smoking preference, pet-friendly, and more.",
      badge: "🎯 Find your vibe",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      delay: 0.1
    },
    {
      icon: <Shield className="h-7 w-7 text-white" />,
      title: "Safety First",
      description: "Verified IDs, driver's license check, vehicle verification, and an emergency SOS button on every journey.",
      badge: "🛡️ 100% verified users",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      delay: 0.2
    },
    {
      icon: <Coins className="h-7 w-7 text-white" />,
      title: "Kindlift Coins",
      description: "Earn coins on every trip! Redeem for free rides, discounts, or donate to charity.",
      badge: "💰 10 coins = 1 free km",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      delay: 0.3
    },
    {
      icon: <Star className="h-7 w-7 text-white" />,
      title: "Trusted Ratings",
      description: "Two-way rating system after each journey. Build your reputation as a great driver or passenger.",
      badge: "⭐ 4.92 average rating",
      gradient: "from-cyan-500 to-sky-600",
      bgGradient: "from-cyan-50 to-sky-50",
      delay: 0.4
    },
    {
      icon: <Gift className="h-7 w-7 text-white" />,
      title: "Referral Rewards",
      description: "Invite friends and get 50 bonus coins each. Build your travel network and earn together!",
      badge: "🎁 Unlimited referrals",
      gradient: "from-rose-500 to-red-600",
      bgGradient: "from-rose-50 to-red-50",
      delay: 0.5
    }
  ];

  const tips = [
    { icon: "💬", title: "Chat First", desc: "Discuss expectations before meeting", delay: 0 },
    { icon: "📍", title: "Share Location", desc: "Share live location for pickup", delay: 0.1 },
    { icon: "🎵", title: "Music Queue", desc: "Take turns with the AUX", delay: 0.2 },
    { icon: "🍎", title: "Snacks Share", desc: "Bring extra to share!", delay: 0.3 }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🚗</div>
          <div className="absolute bottom-20 right-10 text-8xl opacity-10 animate-float-delayed">🛣️</div>
          <div className="absolute top-1/3 left-1/4 text-5xl opacity-5 animate-pulse-slow">✨</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-5 animate-spin-slow">⭐</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-slide-down">
              <span className="text-yellow-300 animate-pulse">🚗💨</span>
              <span className="text-sm font-medium">Long drive ahead? Feeling lonely?</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
              Don't Drive Alone.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 animate-gradient">
                Find Your Ride Buddy
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-xl text-blue-100 mx-auto mb-8 animate-fade-in leading-relaxed">
              You're planning a long journey, but driving solo feels empty and expensive.
              We connect you with fellow travelers heading the same way — share costs,
              share stories, and turn a lonely drive into an unforgettable road trip.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-scale-up">
              <Link
                to="/find-companion"
                className="group px-8 py-4 border border-transparent text-lg font-bold rounded-full text-slate-900 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <span className="inline-flex items-center gap-2">
                  🎯 Find a Travel Companion
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                to="/offer-ride"
                className="group px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white hover:bg-white hover:text-slate-900 shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm"
              >
                <span className="inline-flex items-center gap-2">
                  🙋 I'm Driving — Need Company
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200 animate-fade-in-up">
              <span className="flex items-center gap-1">✅ 10,000+ Happy Journeys</span>
              <span className="flex items-center gap-1">✅ 98% Match Accuracy</span>
              <span className="flex items-center gap-1">✅ Active in 50+ Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Road Track Section with Moving Car */}
      <div className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Road Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
            {/* Video Background */}
            <div className="relative w-full h-[500px] overflow-hidden">
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={car_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Road Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
              
              {/* The Road */}
              <div ref={roadRef} className="absolute bottom-0 left-0 right-0 h-32">
                {/* Road surface */}
                <div className="absolute inset-0 bg-gray-800">
                  {/* Road lines - dashed center line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 transform -translate-y-1/2" 
                       style={{ 
                         backgroundImage: 'repeating-linear-gradient(90deg, #fbbf24, #fbbf24 40px, transparent 40px, transparent 80px)',
                         backgroundSize: '80px 100%'
                       }}>
                  </div>
                  {/* Road edges */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/30"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
                </div>
                
                {/* Moving Car */}
                <div 
                  className="absolute transition-all duration-300 ease-out z-20"
                  style={{
                    bottom: '50%',
                    left: `${carPosition}%`,
                    transform: 'translate(-50%, 50%)',
                    transition: 'left 0.1s linear'
                  }}
                >
                  <div className="relative">
                    {/* Car shadow */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-black/50 rounded-full blur-sm"></div>
                    {/* Car body */}
                    <div className="relative">
                      <div className="text-7xl filter drop-shadow-2xl animate-bounce-subtle">
                        🚗💨
                      </div>
                      {/* Headlight effect */}
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-yellow-400/30 rounded-full blur-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Tire marks on road */}
                <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none">
                  <div className="absolute left-1/4 bottom-2 w-32 h-0.5 bg-white/10"></div>
                  <div className="absolute left-2/4 bottom-2 w-32 h-0.5 bg-white/10"></div>
                  <div className="absolute left-3/4 bottom-2 w-32 h-0.5 bg-white/10"></div>
                </div>
              </div>
            </div>
            
            {/* Instruction overlay */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm z-30">
              <span className="inline-flex items-center gap-2">
                🖱️ Move your mouse to drive the car →
              </span>
            </div>
          </div>
          
          {/* Road caption */}
          <div className="text-center">
            <p className="text-gray-300 text-lg">
              🛣️ <span className="font-semibold text-yellow-400">Move your cursor left and right</span> to drive the car on the road!
            </p>
            <p className="text-gray-400 text-sm mt-2">Watch the car follow your every movement</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide animate-pulse">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-2 mb-4">
              Find Your Ride Buddy in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're driving or looking for a seat, we make it effortless to connect with fellow travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Route className="h-12 w-12 text-white" />, title: "Plan Your Journey", desc: "Enter your starting point, destination, and travel date.", step: "Step 1", gradient: "from-blue-500 to-indigo-600", delay: 0 },
              { icon: <Users className="h-12 w-12 text-white" />, title: "Get Matched", desc: "Our smart algorithm finds travelers going your way.", step: "Step 2", gradient: "from-indigo-500 to-purple-600", delay: 0.2 },
              { icon: <MessageCircle className="h-12 w-12 text-white" />, title: "Connect & Travel", desc: "Chat with your match, coordinate details, and hit the road!", step: "Step 3", gradient: "from-purple-500 to-pink-600", delay: 0.4 }
            ].map((item, i) => (
              <div 
                key={i} 
                className="text-center group animate-slide-up-stagger"
                style={{ animationDelay: `${item.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative">
                  <div className={`w-28 h-28 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-3`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg animate-bounce">
                    {i + 1}
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem vs Solution */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              From <span className="text-red-500">Lonely Drive</span> to{' '}
              <span className="text-green-500">Memorable Journey</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center animate-shake">
                  <span className="text-3xl">😔</span>
                </div>
                <h3 className="text-2xl font-bold text-red-800">The Solo Drive Struggle</h3>
              </div>
              <ul className="space-y-4">
                {["Boring 5-hour drive with no one to talk to", "Full fuel cost on just one person", "No one to share snacks, music, or stories with", "Feeling unsafe driving alone at night", "No help if your car breaks down", "Arriving tired and lonely at your destination"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 animate-slide-left" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-red-500 mt-1">❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800">With Kindlift</h3>
              </div>
              <ul className="space-y-4">
                {["Interesting conversations and new friendships", "Split fuel costs — save up to 50%", "Curate the perfect road trip playlist together", "Safety in numbers during night drives", "Shared responsibility and peace of mind", "Arrive energized with new memories and friends"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 animate-slide-right" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-green-500 mt-1">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Cards with Staggered Animation */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Why Travelers{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Love Kindlift</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've thought of everything to make your shared journey safe, enjoyable, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group opacity-0 animate-card-enter"
                style={{ animationDelay: `${feature.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className={`bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className={`inline-block text-sm font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full ${feature.badge.includes('✨') ? 'text-blue-600' : feature.badge.includes('🎯') ? 'text-green-600' : feature.badge.includes('🛡️') ? 'text-purple-600' : feature.badge.includes('💰') ? 'text-amber-600' : feature.badge.includes('⭐') ? 'text-cyan-600' : 'text-rose-600'}`}>
                    {feature.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Real Stories from the{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Road</span>
            </h2>
            <p className="text-xl text-gray-600">See how Kindlift turned lonely drives into lifelong friendships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", from: "Mumbai → Pune", quote: "I used to dread the 3-hour drive to Pune alone. Now I actually look forward to it! Found a regular travel buddy who loves the same podcasts as me.", rating: 5, avatar: "👩‍💼", delay: 0 },
              { name: "Rahul Verma", from: "Delhi → Jaipur", quote: "Split fuel costs, great conversation, and even made a business connection. Kindlift is a game-changer for solo travelers.", rating: 5, avatar: "👨‍💻", delay: 0.2 },
              { name: "Anjali Nair", from: "Bangalore → Coorg", quote: "Was nervous about sharing a ride at first. But the verification system is solid, and now I've made 3 good friends through Kindlift trips!", rating: 5, avatar: "👩‍🎨", delay: 0.4 }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0 animate-scale-in"
                style={{ animationDelay: `${testimonial.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg animate-pulse-gentle">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.from}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-star-pop" style={{ animationDelay: `${j * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Tips */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Tips for a{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Great Shared Journey</span>
            </h2>
            <p className="text-xl text-gray-600">Make every ride comfortable and memorable</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tips.map((tip, i) => (
              <div 
                key={i} 
                className="text-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 opacity-0 animate-slide-up-stagger"
                style={{ animationDelay: `${tip.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className="text-5xl mb-4 inline-block animate-float-subtle">{tip.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with 3D Effect */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="animate-float-3d">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Ready to Turn Your Next Drive Into an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Adventure</span>
              ?
            </h2>
          </div>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the joy of shared journeys.
            Your next road trip friend is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-companion" className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 shadow-2xl text-lg">
              <span className="inline-flex items-center gap-2">
                🚀 Find My Travel Companion
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link to="/offer-ride" className="group px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-lg backdrop-blur-sm">
              <span className="inline-flex items-center gap-2">
                🙋 I Want to Offer a Ride
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
          <p className="mt-8 text-sm text-blue-200">
            Free to join • No commitment • Cancel anytime
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes star-pop {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-scale-up { animation: scale-up 0.6s ease-out; }
        .animate-card-enter { animation: card-enter 0.6s ease-out forwards; }
        .animate-gradient { background-size: 200% auto; animation: gradient-shift 3s ease infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slow-delayed { animation: pulse-slow 4s ease-in-out infinite 2s; }
        .animate-star-pop { animation: star-pop 0.4s ease-out forwards; }
        .animate-slide-left { animation: slide-left 0.5s ease-out forwards; opacity: 0; }
        .animate-slide-right { animation: slide-right 0.5s ease-out forwards; opacity: 0; }
        .animate-slide-up-stagger { animation: slide-up 0.6s ease-out forwards; opacity: 0; }
        .animate-scale-in { animation: scale-up 0.5s ease-out forwards; opacity: 0; }
        .animate-float-3d { animation: float 4s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-float-subtle { animation: float-subtle 3s ease-in-out infinite; }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-sparkle { animation: sparkle 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};