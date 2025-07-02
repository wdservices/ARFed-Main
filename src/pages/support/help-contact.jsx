import React from "react";

const HelpContact = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-2xl w-full p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Help Center & Contact Us</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-indigo-100">Help Center</h2>
        <p className="mb-4 text-indigo-100">Find answers to common questions, troubleshooting tips, and guides for using ARFed. If you need more help, reach out via the contact form below.</p>
        <ul className="list-disc pl-6 text-indigo-200">
          <li>How to use AR features</li>
          <li>Account and login help</li>
          <li>Model annotation and sharing</li>
          <li>Supported devices and browsers</li>
          <li>Privacy and security</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-indigo-100">Contact Us</h2>
        <p className="mb-4 text-indigo-100">Have a question or feedback? Fill out the form below or email us at <a href="mailto:hello.arfed@gmail.com" className="text-blue-300 underline">hello.arfed@gmail.com</a>.</p>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-indigo-100">Name</label>
            <input type="text" className="w-full border border-indigo-300 rounded px-3 py-2 bg-white/20 text-white placeholder:text-indigo-200" placeholder="Your Name" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-indigo-100">Email</label>
            <input type="email" className="w-full border border-indigo-300 rounded px-3 py-2 bg-white/20 text-white placeholder:text-indigo-200" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-indigo-100">Message</label>
            <textarea className="w-full border border-indigo-300 rounded px-3 py-2 bg-white/20 text-white placeholder:text-indigo-200" rows={4} placeholder="How can we help?" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Send Message</button>
        </form>
      </section>
    </div>
  </div>
);

export default HelpContact; 