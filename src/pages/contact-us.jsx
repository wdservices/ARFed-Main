import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4">
      <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">Contact Us</h1>
        <p className="text-gray-700 mb-8 text-center">Have a question or want to get in touch? Fill out the form below and our team will respond as soon as possible.</p>
        <form className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={4} placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs; 