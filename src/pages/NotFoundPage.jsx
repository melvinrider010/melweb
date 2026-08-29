import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 text-center py-24 space-y-6">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="font-serif font-extrabold text-4xl text-slate-900">404 - Page Not Found</h1>
      <p className="text-slate-600 text-sm max-w-md mx-auto">
        The requested page or historical link has been restructured into our modern Information Architecture.
      </p>
      <Link to="/" className="inline-flex items-center bg-slate-950 text-amber-400 font-bold text-xs px-6 py-3 rounded-lg">
        <Home className="w-4 h-4 mr-2" /> Return to Homepage
      </Link>
    </div>
  );
}
