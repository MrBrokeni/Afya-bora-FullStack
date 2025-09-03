import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Afya Bora</h1>
        <p className="text-gray-600 mb-8">Welcome to Afya Bora - Your Health Partner</p>
        <Link 
          href="/landing" 
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
