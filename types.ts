export interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  status: 'Em Andamento' | 'Quase Lá' | 'Concluído' | 'Novo';
  beneficiaries?: number;
  year?: number;
  power?: string;
  fullDescription?: string;
  objectives?: string[];
  gallery?: string[];
}

export enum ProjectCategory {
  EDUCATION = 'Educação',
  HEALTH = 'Saúde',
  SUSTAINABILITY = 'Sustentabilidade',
  CULTURE = 'Cultura'
}

export interface NavItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  featured?: boolean;
  content?: string;
}