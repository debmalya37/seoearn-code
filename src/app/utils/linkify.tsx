// utils/linkify.tsx (or inside your component file)
import React from 'react';

const urlRegex = /(https?:\/\/[^\s]+)/g;

 export function linkify(text: string): string {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const hyperlink = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${url}</a>`;
    });
  }
