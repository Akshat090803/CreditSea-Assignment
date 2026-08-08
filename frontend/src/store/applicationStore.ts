import { create } from 'zustand';

interface ApplicationState {
  step: number;
  dob: string;
  monthlySalary: number | '';
  employmentMode: string;
  pan: string;
  salarySlipUrl: string;
  amount: number;
  tenure: number;
  setField: <K extends keyof ApplicationFields>(
    field: K,
    value: ApplicationFields[K]
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

type ApplicationFields = Pick<
  ApplicationState,
  "dob" | "monthlySalary" | "employmentMode" | "pan" |
  "salarySlipUrl" | "amount" | "tenure"
>;

export const useApplicationStore = create<ApplicationState>((set) => ({
  step: 1,
  dob: '',
  monthlySalary: '',
  employmentMode: '',
  pan: '',
  salarySlipUrl: '',
  amount: 50000,
  tenure: 30,
  setField: (field, value) => set({ [field]: value }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  reset: () => set({ 
    step: 1, dob: '', monthlySalary: '', employmentMode: '', pan: '', 
    salarySlipUrl: '', amount: 50000, tenure: 30 
  }),
}));