// pages/Forbidden.tsx
import React from "react";
import { Link } from "react-router";

const Forbidden: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <h2 className="text-2xl mb-6">Accès interdit</h2>
      <p className="mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <Link
        to="/calendar"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Retour
      </Link>
    </div>
  );
};

export default Forbidden;
