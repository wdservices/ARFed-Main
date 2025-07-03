import React from "react";

const BookDemo = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-16 px-4">
      <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">Book a Demo</h1>
        <p className="text-gray-700 mb-8 text-center">Fill out the form below and our team will reach out to schedule a personalized ARFed demo for your school or organization.</p>
        <form className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Organization</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="School/Organization Name" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400" rows={4} placeholder="Tell us about your needs..."></textarea>
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BookDemo; 