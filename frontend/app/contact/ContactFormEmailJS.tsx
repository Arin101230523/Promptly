'use client';
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send } from 'lucide-react';

const ContactFormEmailJS = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    subjectText: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSent(false);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR SERVICE ID', 
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR TEMPLATE ID',
        {
           user_name: form.name,
           user_email: form.email,
           subject: form.subject === 'other' ? form.subjectText : form.subject,
          message: form.message
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY 
      );
      setSent(true);
    } catch (err) {
      setError('Failed to send. Please try again.');
    }
    setSending(false);
  };

  return (
    <div className="border-l-4 border-pink-500 pl-3 sm:pl-6 mb-8 sm:mb-12">
      <div className="flex items-center mb-3 sm:mb-6">
        <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-pink-400" />
        <h2 className="text-xl sm:text-3xl font-bold text-pink-300">Quick Contact Form</h2>
      </div>
      <div className="bg-white/5 rounded-lg p-4 sm:p-6">
        <p className="text-gray-300 mb-3 sm:mb-6 text-sm sm:text-base">Need immediate assistance? Fill out this form and we&#39;ll get back to you as soon as possible.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com" />
            </div>
          </div>
          <div className="mb-2 sm:mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <select name="subject" required value={form.subject} onChange={handleChange} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select a category</option>
              <option value="technical">Technical Support</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
            {form.subject === "other" && (
              <input
                name="subjectText"
                type="text"
                required
                value={form.subjectText}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your subject..."
              />
            )}
          </div>
          <div className="mb-3 sm:mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea name="message" rows={4} required value={form.message} onChange={handleChange} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tell us how we can help you..." />
          </div>
          <button type="submit" disabled={sending} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-orange-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center text-sm sm:text-base">
            <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {sending ? "Sending..." : "Send Message"}
          </button>
          {sent && <p className="text-green-400 mt-2">Message sent successfully!</p>}
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactFormEmailJS;