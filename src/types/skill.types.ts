export type SkillCategory =
  | 'LANGUAGES'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASES'
  | 'TOOLS'
  | 'DEVOPS'
  | 'OTHER';

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  level?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
