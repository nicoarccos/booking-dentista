"use client";

import { useState } from "react";
import { Mail, User } from "lucide-react";
import Layout from "../components/Layout";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center bg-gray-100 px-6 py-4 sm:py-8 md:py-12 min-h-screen">
        <div className="w-full max-w-lg shadow-lg rounded-2xl p-6 bg-white">
          <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
          <p className="text-gray-500 text-center mb-6">We would love to hear from you!</p>
          {submitted ? (
            <p className="text-green-600 text-center">Thank you for reaching out! We will get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="flex items-center gap-2 font-medium">
                  <User size={18} /> Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="flex items-center gap-2 font-medium">
                  <Mail size={18} /> Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
