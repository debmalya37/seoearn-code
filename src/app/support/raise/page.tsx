'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RaiseTicketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string|null>(null);
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title, description })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message||'Error');
      router.push('/support/mytickets');
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Raise a Ticket</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded h-32"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Submitting…' : 'Submit Ticket'}
        </button>
      </form>
    </main>
  );
}
