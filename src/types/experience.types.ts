export interface Experience {
  _id: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
  technologies: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
