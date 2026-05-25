export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  objective: string;
  kpi: string[];
  customerSegment: string;
  existingFeatures: string[];
  currentChallenges: string[];
  techStack: string[];
  dependencySystems: string[];
  complianceTags: string[];
  teamId: string;
  poId: string;
  apoIds: string[];
  createdAt: Date;
  vision?: string;
  targetUsers?: number;
  revenueTarget?: string;
}
