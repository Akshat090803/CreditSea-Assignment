"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useApplicationStore } from "@/store/applicationStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/toast";
import { Loader2, X } from "lucide-react";

export default function ApplyPage() {
  const { 
    step, dob, monthlySalary, employmentMode, pan, salarySlipUrl, amount, tenure, 
    setField, nextStep, prevStep, reset 
  } = useApplicationStore();
  
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  // Client-side BRE checks 
  const validateStep1 = () => {
    if (!dob || !monthlySalary || !employmentMode || !pan) {
      toast.add({ type: "error", title: "Missing Fields", description: "Please fill out all fields." });
      return false;
    }
    const age = Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
    if (age < 23 || age > 50) {
      toast.add({ type: "error", title: "BRE Rejected", description: "Age must be between 23 and 50." });
      return false;
    }
    if (Number(monthlySalary) < 25000) {
      toast.add({ type: "error", title: "BRE Rejected", description: "Monthly salary must be at least 25,000." });
      return false;
    }
    if (employmentMode === 'Unemployed') {
      toast.add({ type: "error", title: "BRE Rejected", description: "Applicant cannot be unemployed." });
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      toast.add({ type: "error", title: "Invalid PAN", description: "Format must be ABCDE1234F." });
      return false;
    }
    return true;
  };

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // Max 5MB limit
      toast.add({ type: "error", title: "File too large", description: "Max file size is 5MB." });
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the file backend
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Save the returned Cloudinary URL to the Zustand store
      setField("salarySlipUrl", response.data.url);
      toast.add({ title: "Upload Successful", description: "Your salary slip has been securely attached." });
    } catch (error: any) {
      toast.add({ 
        type: "error", 
        title: "Upload Failed", 
        description: error.response?.data?.error || "Could not upload the file." 
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setField("salarySlipUrl", ""); // Clear from Zustand store
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the HTML input field
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First, update the user profile with personal details
      await api.put("/user/profile", { dob, monthlySalary, employmentMode, pan });

      // Then, submit the final loan application
      await api.post("/loan/apply", { amount, tenure, salarySlipUrl });
      
      toast.add({ title: "Success", description: "Loan application submitted successfully." });
      reset();
      router.push("/borrower-success"); // Redirect to a success screen
    } catch (error: any) {
      toast.add({ 
        type: "error", 
        title: "Application Failed", 
        description: error.response?.data?.error || "Server error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Live Simple Interest Math
  const rate = 12;
  const simpleInterest = (amount * rate * tenure) / (365 * 100);
  const totalRepayment = amount + simpleInterest;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-lg  ">
        <CardHeader>
          <CardTitle>Apply for a Loan</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={dob} onChange={(e) => setField("dob", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Salary (₹)</Label>
                <Input type="number" value={monthlySalary} onChange={(e) => setField("monthlySalary", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Employment Mode</Label>
                <Select onValueChange={(val) => setField("employmentMode", val || "")} value={employmentMode}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input placeholder="ABCDE1234F" value={pan} onChange={(e) => setField("pan", e.target.value.toUpperCase())} />
              </div>
            </div>
          )}

          {/* STEP 2: Upload Salary Slip */}
        {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Salary Slip (PDF/JPG/PNG, Max 5MB)</Label>
                <Input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={handleFileUpload} 
                  disabled={uploadingFile}
                  ref={fileInputRef} // <-- Attach the ref here
                />
              </div>
              
              {uploadingFile && (
                <p className="text-sm text-blue-600 animate-pulse flex items-center"><Loader2 className="animate-spin mr-1 h-3 w-3"/>
                  Uploading securely to cloud...</p>
              )}
              
              {salarySlipUrl && !uploadingFile && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-900">
                  <span className="text-sm font-medium flex items-center gap-2">
                    ✓ File attached successfully
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Loan Config & Apply */}
          {/* {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Loan Amount</Label>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </div>
                <Slider 
                  min={50000} max={500000} step={10000} 
                  value={[amount]} onValueChange={(val) => setField("amount", val[0] )} 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Tenure (Days)</Label>
                  <span className="font-medium">{tenure} days</span>
                </div>
                <Slider 
                  min={30} max={365} step={1} 
                  value={[tenure]} onValueChange={(val) => setField("tenure", val[0])} 
                />
              </div>

              <div className="bg-zinc-100 p-4 rounded-md dark:bg-zinc-900 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Principal</span><span>₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interest (12% p.a.)</span><span>₹{simpleInterest.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-zinc-300 pt-2 mt-2">
                  <span>Total Repayment</span><span>₹{totalRepayment.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )} */}
          {/* STEP 3: Loan Config & Apply */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Loan Amount</Label>
                
                  <span className="font-medium">₹{(amount || 50000).toLocaleString()}</span>
                </div>
                <Slider 
                  min={50000} max={500000} step={10000} 
                  value={[amount || 50000]} 
                  onValueChange={(val) => setField("amount", val as number)} 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Tenure (Days)</Label>
                  <span className="font-medium">{tenure || 30} days</span>
                </div>
                <Slider 
                  min={30} max={365} step={1} 
                  value={[tenure || 30]} 
                  onValueChange={(val) => setField("tenure", val as number)} 
                />
              </div>

              <div className="bg-zinc-100 p-4 rounded-md dark:bg-zinc-900 space-y-2">
                <div className="flex justify-between text-sm">
                  
                  <span>Principal</span><span>₹{(amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interest (12% p.a.)</span><span>₹{(simpleInterest || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-zinc-300 pt-2 mt-2">
                  <span>Total Repayment</span><span>₹{(totalRepayment || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading}>Back</Button>
          
          {step < 3 ? (
            <Button onClick={() => {
              if (step === 1 && validateStep1()) nextStep();
              else if (step === 2) {
                if (!salarySlipUrl) toast.add({ type: "error", title: "Upload Required", description: "Please upload your salary slip." });
                else nextStep();
              }
            }}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}