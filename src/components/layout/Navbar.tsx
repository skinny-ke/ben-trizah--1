"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Heart, 
  Calendar, 
  Image as ImageIcon, 
  StickyNote, 
  Mail, 
  Music,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navItems = [
  { name: "Timeline", href: "/timeline", icon: Calendar },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Notes", href: "/notes", icon: StickyNote },
  { name: "Letters", href: "/letters", icon: Mail },
  { name: "Playlist", href: "/playlist", icon: Music },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Don't show navbar on landing or login pages
  if (pathname === "/" || pathname === "/login") return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("See you soon, love! ❤️");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[95%] max-w-2xl">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-2xl border border-pink-100 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(244,114,182,0.3)] px-3 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-1 md:gap-2 flex-1 justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all",
                  isActive ? "text-pink-600" : "text-pink-300 hover:text-pink-500 hover:bg-pink-50/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-pink-100/50 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive && "fill-pink-600/10")} />
                <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:block">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        
        <div className="w-[1px] h-8 bg-pink-100 mx-2" />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-3 text-pink-300 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </motion.div>
    </nav>
  );
}