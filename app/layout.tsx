import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mindcraft 3D',
  description: 'Build and explore a stylised voxel world directly in your browser.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
