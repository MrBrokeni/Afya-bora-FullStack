import { redirect } from 'next/navigation';

export default function HomePage() {
  // Force server-side redirect
  redirect('/landing');
}
