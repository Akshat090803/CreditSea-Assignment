"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export default function SanctionPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      // Fetch only PENDING (APPLIED) loans
      const response = await api.get("/dashboard/loans?status=PENDING");
      setLoans(response.data.loans);
    } catch (error) {
      toast.add({ type: "error", title: "Error", description: "Could not fetch loans." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // The sanction executive reviews and either approves or rejects (with a reason)[cite: 1]
  const handleAction = async (loanId: string, status: 'SANCTIONED' | 'REJECTED') => {
    if (status === 'REJECTED' && !rejectionReason) {
      toast.add({ type: "error", title: "Reason Required", description: "Please provide a rejection reason." });
      return;
    }

    try {
      await api.put(`/dashboard/sanction/${loanId}`, { status, rejectionReason });
      toast.add({ title: `Loan ${status}`, description: `The loan has been ${status.toLowerCase()}.` });
      setRejectionReason("");
        setOpenDialog(null);
      fetchLoans(); // Refresh the list
    } catch (error: any) {
      toast.add({ type: "error", title: "Action Failed", description: error.response?.data?.error });
    }
  };

  if (loading) return <div className="animate-pulse p-4 md:p-8">Loading applied loans...</div>;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sanction Module</h1>
        <p className="text-sm md:text-base text-zinc-500">Review applied loans and approve or reject them.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>{loans.length} loans awaiting sanction.</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No pending loans.</p>
          ) : (
            <>
              {/* Mobile View: cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {loans.map((loan) => (
                  <div key={loan._id} className="flex flex-col space-y-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-base">{loan.borrowerId?.name}</div>
                        <div className="text-sm text-zinc-500 break-all">{loan.borrowerId?.email}</div>
                      </div>
                      <Badge variant="outline">{loan.tenure} Days</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-md">
                      <div>
                        <span className="block text-xs text-zinc-500">PAN</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{loan.borrowerId?.personalDetails?.pan}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-zinc-500">Amount</span>
                        <span className="font-medium text-blue-600">₹{(loan.amount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="w-1/2 bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => handleAction(loan._id, 'SANCTIONED')}>
                        Approve
                      </Button>
                      
                      <Dialog 
                      open={openDialog === loan._id}
  onOpenChange={(open) => {
    setOpenDialog(open ? loan._id : null);
  }}>
                        <DialogTrigger  className="w-1/2 cursor-pointer">
                          <Button size="sm" variant="destructive" className="w-full">Reject</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Reject Loan Application</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input 
                              placeholder="Enter rejection reason..." 
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <Button className="w-full" variant="destructive" onClick={() => handleAction(loan._id, 'REJECTED')}>
                              Confirm Rejection
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View:  Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tenure</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell>
                          <div className="font-medium">{loan.borrowerId?.name}</div>
                          <div className="text-xs text-zinc-500">{loan.borrowerId?.email}</div>
                        </TableCell>
                        <TableCell>{loan.borrowerId?.personalDetails?.pan}</TableCell>
                        <TableCell className="whitespace-nowrap">₹{(loan.amount || 0).toLocaleString()}</TableCell>
                        <TableCell>{loan.tenure} Days</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(loan._id, 'SANCTIONED')}>
                            Approve
                          </Button>
                          
                          <Dialog
                          open={openDialog === loan._id}
  onOpenChange={(open) => {
    setOpenDialog(open ? loan._id : null);
  }}>
                            <DialogTrigger >
                              <Button size="sm" variant="destructive">Reject</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Loan Application</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <Input 
                                  placeholder="Enter rejection reason..." 
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <Button className="w-full" variant="destructive" onClick={() => handleAction(loan._id, 'REJECTED')}>
                                  Confirm Rejection
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