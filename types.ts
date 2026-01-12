export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface Project {
  id: number | string;
  category: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  status: 'Em Planejamento' | 'Em Andamento' | 'Quase Lá' | 'Concluído' | 'Novo';
  beneficiaries?: number;
  year?: number;
  power?: string;
  fullDescription?: string;
  objectives?: string[];
  gallery?: string[];
  testimonials?: Testimonial[];
  video_url?: string;
}

export enum ProjectCategory {
  EDUCATION = 'Educação',
  HEALTH = 'Saúde',
  SUSTAINABILITY = 'Sustentabilidade',
  CULTURE = 'Cultura',
  WATER = 'Segurança Hídrica'
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