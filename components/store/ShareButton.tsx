"use client";

import { useState } from "react";
import {
  Share2, Copy, Check, X,
  MessageCircle, Facebook, Twitter
} from "lucide-react";

interface ShareButtonProps {
  productName: string;
  productSlug: string;
}

export default function ShareButton({ productName, productSlug }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/productos/${productSlug}`
    : `https://military-eosin.vercel.app/productos/${productSlug}`;

  const text = encodeURIComponent(`¡Mira esto! ${productName} en SGB Military Shop 🎖️`);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
      icon: MessageCircle,
      color: "hover:bg-[#25D366]/20 hover:text-[#25D366]",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: "hover:bg-blue-600/20 hover:text-blue-400",
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      icon: Twitter,
      color: "hover:bg-sky-500/20 hover:text-sky-400",
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Try native share first (mobile)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url });
        return;
      } catch { /* user cancelled */ }
    }
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-accent hover:border-accent/30 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 p-6 w-full max-w-sm rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-sm tracking-widest uppercase text-foreground">Compartir producto</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-body mb-5 line-clamp-1">{productName}</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-3 border border-white/5 rounded-xl text-muted-foreground transition-colors ${link.color}`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-[10px] font-heading tracking-widest uppercase">{link.label}</span>
                </a>
              ))}
            </div>

            <button
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-heading tracking-widest uppercase text-foreground hover:bg-white/10 transition-all"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-accent" /> ¡Enlace copiado!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copiar enlace</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
