"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Award, ArrowUpRight, X, Calendar, Building2, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/lib/types";

export function CertificateGallery({ certificates }: { certificates: Certificate[] }) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedCert]);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

  return (
    <>
      {/* ── Grid Gallery ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <article
            key={cert.id}
            onClick={() => setSelectedCert(cert)}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#171717] transition-all hover:border-blue-500/30 cursor-pointer hover:-translate-y-2 shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full bg-[#f5f5f5] p-6 overflow-hidden">
              {cert.image_url ? (
                <Image src={cert.image_url} alt={cert.title} fill className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-600/20">
                  <Award size={64} strokeWidth={1} />
                </div>
              )}
            </div>

            <div className="p-8 flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold">
                  <Award size={18} />
                </div>
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{cert.issuer}</span>
              </div>
              
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white  group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {cert.title}
              </h3>

   
                   <div className="mt-auto pt-4 gap-2 flex items-center justify-center border-t border-neutral-100 dark:border-white/5">
                     <span className="text-xs font-mono text-neutral-500 whitespace-nowrap ">
                       {formatDate(cert.issued_at)}
                     </span>
                     
                     {cert.credential_url && (
                       <a 
                         href={cert.credential_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                       >
                         Verify <ArrowUpRight size={14} />
                       </a>
  )}

</div>

  {/* 3. Kanan (Penyeimbang kosong) */}


            </div>
          </article>
        ))}
      </div>

      {/* ── Modal (Desktop: Gambar Kiri, Info Kanan) ── */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedCert(null)} />

          <div className="relative w-full max-w-6xl flex flex-col lg:flex-row bg-[#121212] border border-white/10 shadow-3xl rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden max-h-[90vh] lg:h-[700px] animate-in zoom-in-95 duration-300">
            
            {/* Tombol Close */}
            <button onClick={() => setSelectedCert(null)} className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl">
              <X size={24} />
            </button>

            {/* SISI KIRI: Gambar Sertifikat (60% di desktop) */}
            <div className="relative w-full lg:w-3/5 h-[300px] lg:h-full bg-[#f8f8f8] shrink-0 border-b lg:border-b-0 lg:border-r border-white/5">
              <Image 
                src={selectedCert.image_url || ""} 
                alt={selectedCert.title} 
                fill 
                className="object-contain p-8 lg:p-16" 
                priority
              />
            </div>

            {/* SISI KANAN: Informasi & Deskripsi (40% di desktop) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
              <div className="flex-1 overflow-y-auto p-8 lg:p-14 custom-scrollbar">
                <div className="space-y-8">
                  
                  {/* Header Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.3em] text-xs">
                      <Award size={14} /> Certificate Detail
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                      {selectedCert.title}
                    </h2>
                    <div className="flex flex-wrap gap-6 text-sm font-bold">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Building2 size={18} /> {selectedCert.issuer}
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400 font-mono">
                        <Calendar size={18} /> <span className="whitespace-nowrap">{formatDate(selectedCert.issued_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Info size={16} className="text-blue-500" />
                      <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Deskripsi</h4>
                    </div>
                    <p className="text-base lg:text-lg text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {selectedCert.description || "Sertifikasi profesional resmi yang diterbitkan untuk memvalidasi keahlian dan kompetensi di bidang terkait."}
                    </p>
                  </div>

                  {/* Tombol Verify di bagian bawah konten kanan */}
                  {selectedCert.credential_url && (
                    <div className="pt-8">
                      <a 
                        href={selectedCert.credential_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex w-full lg:w-auto items-center justify-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-sm font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                      >
                        VERIFY CREDENTIAL <ArrowUpRight size={20} strokeWidth={3} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}