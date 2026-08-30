import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vaibhav Shaw — Developer, Creator & Builder',
  description: 'Portfolio of Vaibhav Shaw — AIML Engineer, Developer, Innovator & Designer. B.Tech CSE AIML at Sister Nivedita University. Learning with curiosity, building with passion.',
  keywords: ['Vaibhav Shaw', 'Developer', 'AIML Engineer', 'Student', 'Creator', 'Builder', 'Portfolio', 'Sister Nivedita University', 'Next.js', 'GenAI', 'Blockchain'],
  authors: [{ name: 'Vaibhav Shaw' }],
  creator: 'Vaibhav Shaw',
  openGraph: {
    title: 'Vaibhav Shaw — Developer, Creator & Builder',
    description: 'Portfolio of Vaibhav Shaw — AIML Engineer, Developer, Innovator & Designer.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Shaw — Developer, Creator & Builder',
    description: 'Portfolio of Vaibhav Shaw — AIML Engineer, Developer, Innovator & Designer.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
