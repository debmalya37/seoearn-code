'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Server error');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions or need support? Fill out the form below and our team will get back to you within 24 hours.
      </p>

      {sent ? (
        <div className="p-6 bg-green-100 text-green-800 rounded-lg">
          Thank you! Your message has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          <label className="block">
            <span className="font-medium">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded focus:ring focus:border-blue-300"
            />
          </label>
          <label className="block">
            <span className="font-medium">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded focus:ring focus:border-blue-300"
            />
          </label>
          <label className="block">
            <span className="font-medium">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded focus:ring focus:border-blue-300 resize-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </main>
  );
}
