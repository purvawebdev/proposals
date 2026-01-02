// components/GenerateButton.jsx
import React from 'react';

export const GenerateButton = ({ loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Generating..." : "Generate PDF"}
  </button>
);