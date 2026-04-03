import React from 'react';
import { Users, Leaf, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">About Kindlift</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to reshape how the world commutes, one shared ride at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-500 inline-block pb-2">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Kindlift was born from a simple idea: empty seats in cars are a wasted resource. In a world facing climate change and rising fuel costs, we built a platform that brings people together while taking cars off the road.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By leveraging smart routing, real-time matching, and a unique coin-reward system, we've transformed ride-sharing from a transaction into a community-driven movement.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl text-center transform shadow-lg hover:scale-105 transition-transform duration-300">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">10k+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl text-center transform shadow-lg hover:scale-105 transition-transform duration-300 translate-y-6">
            <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">50+</h3>
            <p className="text-gray-600">Cities Covered</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl text-center transform shadow-lg hover:scale-105 transition-transform duration-300 -translate-y-6">
            <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">500t</h3>
            <p className="text-gray-600">CO2 Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
};
