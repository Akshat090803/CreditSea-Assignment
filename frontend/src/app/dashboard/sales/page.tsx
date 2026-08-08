"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

interface Lead {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/dashboard/sales");
        setLeads(response.data.leads);
      } catch (error: any) {
        toast.add({
          type: "error",
          title: "Error fetching leads",
          description: error.response?.data?.error || "Failed to load sales data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <div className="animate-pulse p-4 md:p-8">Loading leads...</div>;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Module</h1>
        <p className="text-sm md:text-base text-zinc-500">Track registered users who haven&apos;t applied for a loan yet.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Leads</CardTitle>
          <CardDescription>Total leads pending application: {leads.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No active leads at the moment.</p>
          ) : (
            <>
              {/* Mobile View: cards*/}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {leads.map((lead) => (
                  <div key={lead._id} className="flex flex-col space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-base">{lead.name}</span>
                      <Badge variant="secondary">Pre-Application</Badge>
                    </div>
                    <div className="text-sm text-zinc-500 break-all">{lead.email}</div>
                    <div className="text-xs text-zinc-400">
                      Registered: {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View:  Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{lead.email}</TableCell>
                        <TableCell className="whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pre-Application</Badge>
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