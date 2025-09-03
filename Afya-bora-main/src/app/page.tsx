import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  // Try server-side redirect first
  try {
    redirect('/landing');
  } catch (error) {
    // Fallback: render a client-side redirect component
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Afya Bora</h1>
          <p className="text-gray-600 mb-8">Redirecting to landing page...</p>
          <Link 
            href="/landing" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Landing Page
          </Link>
        </div>
      </div>
    );
  }
}

// Ensure this page is not statically generated
export const dynamic = 'force-dynamic';
