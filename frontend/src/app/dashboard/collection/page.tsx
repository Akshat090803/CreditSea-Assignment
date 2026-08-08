"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export default function CollectionPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const fetchActiveLoans = async () => {
    try {
      // Fetch only active (DISBURSED) loans
      const response = await api.get("/dashboard/loans?status=DISBURSED");
      setLoans(response.data.loans);
    } catch (error) {
      toast.add({ type: "error", title: "Error", description: "Could not fetch active loans." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const handlePayment = async (loanId: string) => {
    if (!utrNumber || !paymentAmount) {
      toast.add({ type: "error", title: "Missing Fields", description: "UTR and Amount are required." });
      return;
    }

    try {
      const response = await api.post(`/dashboard/collection/${loanId}`, {
        utrNumber,
        amount: Number(paymentAmount)
      });
      
      toast.add({ 
        title: "Payment Recorded", 
        description: response.data.message 
      });
      
      setUtrNumber("");
      setPaymentAmount("");
      setOpenDialog(null);
      fetchActiveLoans(); // Refresh the list to remove closed loans
    } catch (error: any) {
      toast.add({ 
        type: "error", 
        title: "Payment Failed", 
        description: error.response?.data?.error || "Invalid payment request." 
      });
    }
  };

  if (loading) return <div className="animate-pulse p-4 md:p-8">Loading active loans...</div>;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Collection Module</h1>
        <p className="text-sm md:text-base text-zinc-500">Record payments for active disbursed loans.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>{loans.length} loans currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No active loans found.</p>
          ) : (
            <>
              {/* Mobile View: Stacked cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {loans.map((loan) => (
                  <div key={loan._id} className="flex flex-col space-y-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <div>
                      <div className="font-medium text-base">{loan.borrowerId?.name}</div>
                      <div className="text-sm text-zinc-500 break-all">{loan.borrowerId?.email}</div>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-md">
                      <span className="block text-xs text-zinc-500 mb-1">Total Repayment</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        ₹{(loan.totalRepayment || 0).toFixed(2)}
                      </span>
                    </div>

                    <Dialog
                     open={openDialog === loan._id}
  onOpenChange={(open) => {
    setOpenDialog(open ? loan._id : null);
  }}>
                      <DialogTrigger>
                        <Button className="w-full mt-2">Record Payment</Button>
                      </DialogTrigger>
                      <DialogContent className="w-[90vw] max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Record Payment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>UTR Number (Must be unique)</Label>
                            <Input 
                              placeholder="e.g. UTR123456789" 
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Amount Paid (₹)</Label>
                            <Input 
                              type="number"
                              placeholder="Enter amount" 
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                          </div>
                          <Button className="w-full" onClick={() => handlePayment(loan._id)}>
                            Submit Payment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>

              {/* Desktop View:  Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
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
                        <TableCell className="whitespace-nowrap">
                          ₹{(loan.totalRepayment || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Dialog  open={openDialog === loan._id}
  onOpenChange={(open) => {
    setOpenDialog(open ? loan._id : null);
  }}>
                            <DialogTrigger >
                              <Button size="sm">Record Payment</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Record Payment</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                  <Label>UTR Number (Must be unique)</Label>
                                  <Input 
                                    placeholder="e.g. UTR123456789" 
                                    value={utrNumber}
                                    onChange={(e) => setUtrNumber(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Amount Paid (₹)</Label>
                                  <Input 
                                    type="number"
                                    placeholder="Enter amount" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                  />
                                </div>
                                <Button className="w-full" onClick={() => handlePayment(loan._id)}>
                                  Submit Payment
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
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