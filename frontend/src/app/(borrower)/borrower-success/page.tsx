"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, LogOut } from "lucide-react";

export default function BorrowerSuccessPage() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleReApply=()=>router.replace("/apply");

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-md text-center ">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Application Submitted!</CardTitle>
          <CardDescription>
            Your loan application has been successfully submitted and is currently under review by our Sanction team.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg text-left text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Current Status</span>
              <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded text-xs border border-blue-200 dark:border-blue-800">
                APPLIED
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Next Stage</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Sanction Executive Review
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            An internal executive will verify your submitted details and salary slip.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full flex cursor-pointer hover:opacity-85 transition " onClick={handleReApply}>
           
              <span>Submit Another Application</span>
            
             <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full border border-gray-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}