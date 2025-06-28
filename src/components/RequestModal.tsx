// src/components/RequestModal.tsx
'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@src/components/ui/button'
import {
     Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
    } from '@src/components/ui/dialog'
import { useToast } from '@src/components/ui/use-toast'

export interface IRequest {
    id: string
  userId: { username: string; email: string }
  message?: string
  fileUrl?: string
  status: string
  createdAt: string
}

interface Props {
  open: boolean
  taskId: string
  onClose: () => void
}

export default function RequestModal({ open, taskId, onClose }: Props) {
  const [requests, setRequests] = useState<IRequest[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!open) return
    axios.get<{ success: boolean; requests: IRequest[] }>(`/api/tasks/${taskId}/requests`)
      .then(r => setRequests(r.data.requests))
  }, [open, taskId])

  const handleAction = async (requestId: string, action: 'Approved' | 'Rejected') => {
    try {
      const res = await axios.patch<{ success: boolean; requests: IRequest[] }>(
        `/api/tasks/${taskId}/requests/${requestId}`,
        { action }
      )
      setRequests(res.data.requests)
      toast({ title: `Request ${action}`, description: `User’s request has been ${action.toLowerCase()}.` })
    } catch (e) {
      toast({ title: 'Error', description: 'Couldn’t update request', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submissions for Task</DialogTitle>
        </DialogHeader>

        {requests.length === 0 
          ? <p className="p-4 text-center">No submissions yet.</p>
          : requests.map(req => (
            <div key={req.id} className="border-b last:border-b-0 p-4 space-y-2">
              <p><strong>User:</strong> {req.userId.username} ({req.userId.email})</p>
              {req.message && <p><strong>Note:</strong> {req.message}</p>}
              {req.fileUrl && (
                <p>
                  <strong>File:</strong>{' '}
                  <a href={req.fileUrl} target="_blank" className="text-blue-600 hover:underline">
                    View
                  </a>
                </p>
              )}
              <p className="text-xs text-gray-500">Submitted: {new Date(req.createdAt).toLocaleString()}</p>

              <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleAction(req.id, 'Approved')}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => handleAction(req.id, 'Rejected')}>Reject</Button>
                  
              </div>
            </div>
          ))
        }

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
