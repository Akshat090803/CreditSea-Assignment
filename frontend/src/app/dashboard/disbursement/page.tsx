"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";

export default function DisbursementPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSanctionedLoans = async () => {
    try {
      // Fetch only SANCTIONED loans
      const response = await api.get("/dashboard/loans?status=SANCTIONED");
      setLoans(response.data.loans);
    } catch (error) {
      toast.add({ type: "error", title: "Error", description: "Could not fetch sanctioned loans." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanctionedLoans();
  }, []);

  const handleDisburse = async (loanId: string) => {
    setProcessingId(loanId);
    try {
      await api.put(`/dashboard/disburse/${loanId}`);
      toast.add({ title: "Funds Disbursed", description: "The loan status is now DISBURSED." });
      fetchSanctionedLoans(); // Refresh the list
    } catch (error: any) {
      toast.add({ type: "error", title: "Disbursement Failed", description: error.response?.data?.error });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="animate-pulse p-4 md:p-8">Loading sanctioned loans...</div>;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Disbursement Module</h1>
        <p className="text-sm md:text-base text-zinc-500">Release funds for approved loans.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sanctioned Loans</CardTitle>
          <CardDescription>{loans.length} loans awaiting disbursement.</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No loans pending disbursement.</p>
          ) : (
            <>
              {/* Mobile View: Stacked cards*/}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {loans.map((loan) => (
                  <div key={loan._id} className="flex flex-col space-y-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <div>
                      <div className="font-medium text-base">{loan.borrowerId?.name}</div>
                      <div className="text-sm text-zinc-500 break-all">{loan.borrowerId?.email}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-md">
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">Amount to Disburse</span>
                        <span className="font-bold text-blue-600">₹{(loan.amount || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">Total Repayment</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">₹{(loan.totalRepayment || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-2"
                      onClick={() => handleDisburse(loan._id)}
                      disabled={processingId === loan._id}
                    >
                      {processingId === loan._id ? "Processing..." : "Disburse Funds"}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount to Disburse</TableHead>
                      <TableHead>Total Repayment</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell>
                          <div className="font-medium">{loan.borrowerId?.name}</div>
                          <div className="text-xs text-zinc-500">{loan.borrowerId?.email}</div>
                        </TableCell>
                        <TableCell className="font-bold text-blue-600 whitespace-nowrap">
                          ₹{(loan.amount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ₹{(loan.totalRepayment || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleDisburse(loan._id)}
                            disabled={processingId === loan._id}
                          >
                            {processingId === loan._id ? "Processing..." : "Disburse Funds"}
                          </Button>
                        </TableCell>
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