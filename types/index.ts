export interface Presentation {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
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
