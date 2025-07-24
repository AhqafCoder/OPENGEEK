'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-black group-[.toaster]:text-zinc-50 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-zinc-400',
          actionButton:
            'group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50',
          cancelButton:
            'group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400',
        },
      }}
    />
  );
}