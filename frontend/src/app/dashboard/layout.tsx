"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { 
  LayoutDashboard, Users, FileCheck, Banknote, CreditCard, LogOut, Menu, X
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if unauthenticated or if a Borrower tries to access the dashboard
  useEffect(() => {
    if (!role || role === "Borrower") {
      router.push("/login");
    }
  }, [role, router]);

  const handleCloseMenu=()=>{ setIsMobileMenuOpen(false);}
  useEffect(() => {
   handleCloseMenu();
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!role || role === "Borrower") return null;

  
  const NavLinks = () => (
    <>
      {(role === "Admin" || role === "Sales") && (
        <Link href="/dashboard/sales" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Users className="h-5 w-5" />
          Sales (Leads)
        </Link>
      )}
      {(role === "Admin" || role === "Sanction") && (
        <Link href="/dashboard/sanction" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <FileCheck className="h-5 w-5" />
          Sanction
        </Link>
      )}
      {(role === "Admin" || role === "Disbursement") && (
        <Link href="/dashboard/disbursement" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Banknote className="h-5 w-5" />
          Disbursement
        </Link>
      )}
      {(role === "Admin" || role === "Collection") && (
        <Link href="/dashboard/collection" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <CreditCard className="h-5 w-5" />
          Collection
        </Link>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950 overflow-hidden relative">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 absolute top-0 w-full z-30">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          LMS Admin
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-20 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        <div className="hidden md:block p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            LMS Admin
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Role: <span className="font-medium text-zinc-900 dark:text-zinc-100">{role}</span></p>
        </div>
        
        {/* Mobile Role Display */}
        <div className="md:hidden p-4 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">Logged in as: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{role}</span></p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-left text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden mt-16" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0 w-full">
        {children}
      </main>
    </div>
  );
}