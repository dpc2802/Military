import fs from "fs";

const code = `"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header Action */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-white/5 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Area */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="w-full max-w-2xl relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué estás buscando? (Ej. Botas, Cinturón...)"
                className="w-full bg-transparent border-b-2 border-white/20 px-14 py-4 text-xl md:text-3xl font-heading tracking-wider text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="bg-accent text-background px-4 py-2 text-xs font-heading tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </motion.form>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground/60 text-xs font-body uppercase tracking-widest mt-6"
            >
              Presiona Enter para buscar
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;

fs.writeFileSync("c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/SearchOverlay.tsx", code, "utf-8");
console.log("Created SearchOverlay component");
