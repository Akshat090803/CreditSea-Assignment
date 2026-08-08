//this details will be checked
interface ApplicationData {
  dob: Date;
  monthlySalary: number;
  employmentMode: string;
  pan: string;
}

export const runBusinessRuleEngine = (data: ApplicationData): { passed: boolean; error?: string } => {
  const age = calculateAge(new Date(data.dob));
  if (age < 23 || age > 50) return { passed: false, error: "Age must be between 23 and 50." };
  if (data.monthlySalary < 25000) return { passed: false, error: "Monthly salary must be at least 25,000." };
  if (data.employmentMode === 'Unemployed') return { passed: false, error: "Applicant cannot be unemployed." };
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(data.pan)) return { passed: false, error: "Invalid PAN format." };

  return { passed: true };
};

const calculateAge = (dob: Date): number => {
  const diffMs = Date.now() - dob.getTime(); //give age worth of milliseconds 
  const ageDt = new Date(diffMs); //create date again 1970 + milliseonds

  //that JavaScript dates start at: 1 Jan 1970 so 1970-ageDt give age
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export const calculateRepayment = (principal: number, tenureDays: number): number => {
  const rate = 12; // 12% p.a.
  const simpleInterest = (principal * rate * tenureDays) / (365 * 100);
  return principal + simpleInterest;
};