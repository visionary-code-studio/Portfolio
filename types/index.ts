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

export interface FutureThought {
  id: string;
  category: string;
  title: string;
  content: string;
  year: number;
  featured?: boolean;
  published?: boolean;
  order?: number;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  description: string;
  priority: string;
  published?: boolean;
  subtopics?: string[];
}

export interface Profile {
  fullName: string;
  displayName: string;
  handle: string;
  tagline: string;
  headline: string;
  shortBio: string;
  longBio: string;
  personaLayers?: Array<{
    title: string;
    tag: string;
    description: string;
  }>;
  philosophy?: {
    quote?: string;
    creed?: string;
    belief?: string;
  };
  university?: {
    name?: string;
    degree?: string;
    branch?: string;
    year?: string;
    semester?: string;
    expectedGraduation?: string;
    location?: string;
    cgpa?: string | number;
  };
  school?: {
    name?: string;
    board?: string;
    location?: string;
    passingYear?: string;
    class10Score?: string;
    class12Score?: string;
  };
  email?: string;
  location?: string;
  socialLinks?: Array<{
    platform: string;
    label: string;
    url: string;
    visible?: boolean;
  }>;
  media?: {
    heroVideo?: string;
    heroPoster?: string;
    profileImage?: string;
  };
  academics?: {
    university: string;
    degree: string;
    specialization: string;
    cgpa: string | number;
    year: string;
    semester: string;
    status: string;
  };
  contact?: {
    email: string;
    location: string;
    availability: string;
    freelance: boolean;
  };
  socials?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  year: number | string;
  description: string;
  role: string;
  technologies: string[];
  repoUrl?: string;
  liveUrl?: string;
  image?: string;
  featured?: boolean;
}

