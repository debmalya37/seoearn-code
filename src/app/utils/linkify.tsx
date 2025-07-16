// utils/linkify.tsx (or inside your component file)
import React from 'react';

const urlRegex = /(https?:\/\/[^\s]+)/g;

export function linkify(text: string) {
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
