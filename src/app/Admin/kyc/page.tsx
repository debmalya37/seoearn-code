// src/app/admin/kyc/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@src/components/ui/button'; // assume you have these
import {Modal} from '@src/components/ui/modal';
import {Textarea} from '@src/components/ui/Textarea';
import { useToast } from '@src/components/ui/use-toast';


interface KycRecord {
  userId: string;
  name: string;
  email: string;
  submittedAt: string;
  docs: {
    idFrontUrl: string;
    idBackUrl?: string;
    selfieUrl: string;
  };
}

export default function AdminKycPage() {
  const [records, setRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    record?: KycRecord;
    decision: 'approve' | 'reject';
    notes: string;
  }>({ open: false, decision: 'approve', notes: '' });
  const { toast } = useToast();

  // Fetch pending KYC
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kyc');
      const json = await res.json();
      if (json.success) setRecords(json.list);
      else toast({ title: 'Error', description: json.message, variant: 'destructive' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  // Trigger modal
  const openModal = (record: KycRecord, decision: 'approve' | 'reject') => {
    setModal({ open: true, record, decision, notes: '' });
  };

  // Submit decision
  const submitDecision = async () => {
    if (!modal.record) return;
    try {
      const res = await fetch(`/api/admin/kyc/${modal.record.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: modal.decision, notes: modal.notes }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast({ title: `User ${modal.decision}`, variant: 'default' });
      setModal({ ...modal, open: false });
      // Remove from list
      setRecords(r => r.filter(rec => rec.userId !== modal.record!.userId));
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) return <p className="p-8">Loading pending KYC…</p>;
  if (records.length === 0) return <p className="p-8">No pending KYC requests.</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Pending KYC Verifications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map(rec => (
          <div key={rec.userId} className="bg-white p-4 rounded-lg shadow">
            <p><strong>{rec.name}</strong> <span className="text-sm text-gray-500">({rec.email})</span></p>
            <p className="text-sm text-gray-400 mb-3">
              Requested: {new Date(rec.submittedAt).toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <DocumentThumbnail url={rec.docs.idFrontUrl} label="ID Front" />
              {rec.docs.idBackUrl && <DocumentThumbnail url={rec.docs.idBackUrl} label="ID Back" />}
              <DocumentThumbnail url={rec.docs.selfieUrl} label="Selfie" />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={() => openModal(rec, 'approve')}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => openModal(rec, 'reject')}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <Modal onClose={() => setModal({ ...modal, open: false })}>
          <h2 className="text-xl font-semibold mb-4">
            {modal.decision === 'approve' ? 'Approve' : 'Reject'} KYC for&nbsp;
            <span className="font-bold">{modal.record!.name}</span>
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {modal.decision === 'approve'
              ? 'You are about to mark this user as VERIFIED. This action cannot be undone.'
              : 'Please provide a reason for rejection so the user can correct and re‑submit.'}
          </p>
          <Textarea
            placeholder="Optional notes..."
            value={modal.notes}
            onChange={(e:any) => setModal(m => ({ ...m, notes: e.target.value }))}
            rows={4}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setModal({ ...modal, open: false })}>
              Cancel
            </Button>
            <Button
              variant={modal.decision === 'approve' ? 'default' : 'destructive'}
              onClick={submitDecision}
            >
              Confirm {modal.decision === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Thumbnail helper
function DocumentThumbnail({
  url,
  label,
}: { url: string; label: string }) {
  return (
    <figure className="flex flex-col items-center">
      <img
        src={url}
        alt={label}
        className="w-24 h-16 object-cover rounded border"
        onClick={() => window.open(url, '_blank')}
      />
      <figcaption className="text-xs mt-1 text-gray-500">{label}</figcaption>
    </figure>
  );
}
