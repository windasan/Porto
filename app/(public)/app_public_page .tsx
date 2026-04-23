/**
 * app/(public)/page.tsx — Home Page
 * * Struktur:
 * 1. Hero (Desktop: Gambar Kanan, Mobile: Rata Tengah) - Lebih lebar
 * 2. Featured Projects (Ambil 3 dari tabel 'projects') - Menggunakan prose-layout
 * 3. Latest Blog (Ambil 3 dari tabel 'posts') - Menggunakan prose-layout
 * 4. About Section (Rapi & Minimalis) - Menggunakan prose-layout
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { 
  ArrowRight, 
  Github, 
  ArrowUpRight, 
  Calendar
} from "lucide-react";

import type { Project, Post } from '@/lib/types';

async function getHomeProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false })
    .limit(3);
  return (data ?? []) as Project[];
}
async function getLatestPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data ?? []) as Post[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const projects = await getHomeProjects();
  const posts = await getLatestPosts();

  return (
    // Tambahkan overflow-x-hidden di sini untuk mencegah scroll horizontal di mobile
    <div className="flex flex-col py-16 md:py-24 overflow-x-hidden">
      
      {/* ── 1. HERO SECTION (Lebih Luas) ───────────────────────────────────── */}
      {/* Container terpisah dengan padding lebih kecil (px-4) dan max-w lebih besar */}
      <section className="container mx-auto px-4 md:px-32 max-w-6xl mb-32">
        <div className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between gap-12 min-h-[60vh]">
          
          {/* Avatar Area */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl" />
            <div className="absolute inset-0 rounded-full border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm" />
            
            <Image
              src="/image/profil_pic.png" 
              alt="Edwinda Santosa"
              width={500}
              height={500}
              priority
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[135%] max-w-none object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Text Area */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-6 font-mono text-[10px] tracking-widest text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AVAILABLE FOR HIRE
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.1]">
              Edwinda <span className="text-blue-600 dark:text-blue-500">Santosa</span>
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 text-lg lg:text-l leading-relaxed mb-10">
              
              Bridging the gap between modern <span className="text-neutral-900 dark:text-white font-medium">web development</span> and <span className="text-neutral-900 dark:text-white font-medium">robust cybersecurity</span>. I build digital experiences that are not only high-performing and scalable, but secure by design
            </p>

           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
  
  {/* ── Wrapper untuk Button 1 & Teks Kecil ── */}
  <div className="flex flex-col items-center w-full sm:w-auto">
    <a 
      href="https://cybli.cryed.cloud" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all text-center"
    >
      Bibliotheque
    </a>
    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 text-center font-medium">
      *latest project
    </span>
  </div>

  {/* ── Button 2 (Tetap) ── */}
  <Link 
    href="/contact" 
    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white font-bold border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-center"
  >
    Get in touch
  </Link>
  
</div>
          </div>
        </div>
      </section>

           {/* ── WRAPPER BAWAH (Projects, Blog, About) menggunakan prose-layout ── */}
      <div className="prose-layout w-full mx-auto flex flex-col gap-32">

       <section>
          <div className="py-16 md:py-20 px-8 bg-neutral-50 dark:bg-neutral-900/30 rounded-[3rem] border border-neutral-200 dark:border-white/5 backdrop-blur-sm relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 blur-[100px]" />
            
            <div className="relative z-10">
              <h2 className="text-[14px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500 mb-8">About Me</h2>
              <p className="text-l md:text-l text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium mb-10">
                Hi, I'm Edwin digitally known as Cyborged. I am a <span className="text-neutral-900 dark:text-white">Full-Stack Developer</span> and <span className="text-neutral-900 dark:text-white">Cybersecurity Analyst</span> focused on building fast, scalable, and secure digital ecosystems from the very first line of code.
                <br /><br />
                For me, web development isn't just about writing beautiful interfaces; it's about building a solid defensive architecture to protect users and their data.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <Badge className="bg-neutral-200 text-neutral-700 dark:bg-white/5 dark:text-neutral-400 border-none px-4 py-1.5 hover:bg-neutral-300 dark:hover:bg-white/10 transition-colors cursor-default">Next.js</Badge>
                <Badge className="bg-neutral-200 text-neutral-700 dark:bg-white/5 dark:text-neutral-400 border-none px-4 py-1.5 hover:bg-neutral-300 dark:hover:bg-white/10 transition-colors cursor-default">Security Auditing</Badge>
                <Badge className="bg-neutral-200 text-neutral-700 dark:bg-white/5 dark:text-neutral-400 border-none px-4 py-1.5 hover:bg-neutral-300 dark:hover:bg-white/10 transition-colors cursor-default">Supabase</Badge>
              </div>
            </div>
          </div>
        </section>

 
        
        {/* ── 2. FEATURED PROJECTS (WORK) ───────────────────────────────────── */}
        <section id="work" className="scroll-mt-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Featured Projects</h2>
              <p className="text-neutral-600 dark:text-neutral-500 text-sm">Pilihan proyek terbaik yang saya kerjakan.</p>
            </div>
            <Link href="/work" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm">
              See All Work <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="group relative flex flex-col rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/50 shadow-sm dark:shadow-none overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-2">
                <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                  {project.image_url && (
                    <Image src={project.image_url} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}
                </div>
                <div className="p-6 flex flex-1 flex-col">
                  <span className="text-xs font-mono text-neutral-500 mb-2 tabular-nums">{project.year}</span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{project.description}</p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                    {project.url && (
                      <a href={project.url} target="_blank" className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Live <ArrowUpRight size={14} />
                      </a>
                    )}
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <Github size={14} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 3. LATEST BLOG (POSTS) ────────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Latest Articles</h2>
              <p className="text-neutral-600 dark:text-neutral-500 text-sm">Wawasan seputar pengembangan web dan keamanan.</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm">
              Read Blog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row sm:items-center gap-6 p-5 rounded-[2rem] border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/50 shadow-sm dark:shadow-none hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all">
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                  {post.cover_url && <Image src={post.cover_url} alt={post.title} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-semibold">
                    <Calendar size={12} className="text-blue-600 dark:text-blue-500" />
                    {formatDate(post.created_at)}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{post.title}</h3>
                </div>
                <ArrowRight className="hidden sm:block text-neutral-400 dark:text-neutral-700 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. ABOUT SECTION ──────────────────────────────────────────────── */}
       

      </div>
    </div>
  );
}