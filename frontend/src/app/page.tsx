import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, UserCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Loan Management System
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A complete, end-to-end lending platform. Apply for loans seamlessly or manage the entire loan lifecycle through our executive dashboard.
        </p>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Borrower Portal Card */}
        <Card className="hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <UserCircle className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Borrower Portal</CardTitle>
            <CardDescription className="text-base">
              Need a loan? Create an account, fill out your personal details, and configure your loan amount and tenure in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pl-0 ml-0">
            <div className="flex gap-3 px-4">
              <Button asChild className="w-1/2">
                <Link href="/register" className="w-full flex items-center justify-center">
                  Apply Now <ArrowRight className=" ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-1/2">
                <Link href="/login" className="w-full flex items-center justify-center">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operations Dashboard Card */}
        <Card className="hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Operations Dashboard</CardTitle>
            <CardDescription className="text-base">
              Internal executive portal. Manage sales leads, sanction loans, disburse funds, and track collections. Guarded by role-based access.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button asChild variant="secondary" className="w-full border border-gray-500 hover:bg-black hover:text-white transition">
              <Link href="/login" className="w-full flex justify-center items-center">
                Access Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}