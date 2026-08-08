"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { Activity, FileText, Banknote, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        // Fetching without a status query parameter returns ALL loans
        const response = await api.get("/dashboard/loans");
        setLoans(response.data.loans);
      } catch (error) {
        toast.add({ type: "error", title: "Error", description: "Could not fetch platform data." });
      } finally {
        setLoading(false);
      }
    };

    fetchAllLoans();
  }, []);

  if (loading) return <div className="animate-pulse p-4 md:p-8">Loading admin dashboard...</div>;

  // Calculate Metrics
  const totalApplications = loans.length;
  const pendingSanction = loans.filter(l => l.status === "PENDING").length;
  const readyToDisburse = loans.filter(l => l.status === "SANCTIONED").length;
  const activeLoans = loans.filter(l => l.status === "DISBURSED").length;
  const closedLoans = loans.filter(l => l.status === "CLOSED").length;

  const totalValueActive = loans
    .filter(l => l.status === "DISBURSED")
    .reduce((sum, loan) => sum + (loan.amount || 0), 0);

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Sanction</Badge>;
      case 'SANCTIONED': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ready to Disburse</Badge>;
      case 'DISBURSED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active (Disbursed)</Badge>;
      case 'CLOSED': return <Badge variant="outline" className="text-zinc-500 border-zinc-300">Closed</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-sm md:text-base text-zinc-500">Master view of all loan activities across the platform.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-zinc-500 mt-1">{pendingSanction} awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Disbursement</CardTitle>
            <Banknote className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyToDisburse}</div>
            <p className="text-xs text-zinc-500 mt-1">Sanctioned, funds pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Portfolio</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-zinc-500 mt-1">₹{totalValueActive.toLocaleString()} currently deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Loans</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedLoans}</div>
            <p className="text-xs text-zinc-500 mt-1">Successfully repaid</p>
          </CardContent>
        </Card>
      </div>

      {/* Master Ledger List */}
      <Card>
        <CardHeader>
          <CardTitle>Master Ledger</CardTitle>
          <CardDescription>A complete history of all loan applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No applications found in the system.</p>
          ) : (
            <>
              {/* Mobile View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {loans.map((loan) => (
                  <div key={loan._id} className="flex flex-col space-y-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-base">{loan.borrowerId?.name}</div>
                        <div className="text-sm text-zinc-500 break-all">{loan.borrowerId?.email}</div>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                    <div className="flex justify-between text-sm bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-md mt-2">
                      <span className="text-zinc-500">Principal:</span>
                      <span className="font-medium">₹{(loan.amount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Principal Amount</TableHead>
                      <TableHead>Tenure</TableHead>
                      <TableHead>Current Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sort to show newest first */}
                    {[...loans].reverse().map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell>
                          <div className="font-medium">{loan.borrowerId?.name}</div>
                          <div className="text-xs text-zinc-500">{loan.borrowerId?.email}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">₹{(loan.amount || 0).toLocaleString()}</TableCell>
                        <TableCell>{loan.tenure} Days</TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}