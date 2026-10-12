export interface Presentation {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  event?: string;
  preview?: string;
  file?: string;
  tags?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number | string;
  category: string;
  credentialId?: string;
  preview?: string;
  file?: string;
}

export interface CollabService {
  id: string;
  title: string;
  category: 'web-dev' | 'graphic-design' | 'ecommerce' | string;
  tagline: string;
  price: string;
  timeline: string;
  featured?: boolean;
  popular?: boolean;
  description: string;
  deliverables: string[];
  techStack: string[];
  badge?: string;
}
