import React from 'react';
import { Check } from "lucide-react";
import { ENGINEERING_BRANCHES } from "../constants/engineeringData";

// Helper for inputs
const TableInput = ({ value, onChange, placeholder }) => (
  <input
    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    value={value}
    onChange={onChange}
    placeholder={placeholder || "0"}
    type="number"
  />
);

export default function EngineeringForm({ engFields, setEngFields }) {
  // 1. Branch Selection Logic
  const selectedBranches = engFields.selectedBranches || [];

  const allBranchIds = ENGINEERING_BRANCHES.map(b => b.id);
  const isAllSelected = selectedBranches.length === allBranchIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setEngFields({ ...engFields, selectedBranches: [] }); // Deselect All
    } else {
      setEngFields({ ...engFields, selectedBranches: allBranchIds }); // Select All
    }
  };

  const toggleBranch = (id) => {
    if (selectedBranches.includes(id)) {
      setEngFields({ ...engFields, selectedBranches: selectedBranches.filter(b => b !== id) });
    } else {
      setEngFields({ ...engFields, selectedBranches: [...selectedBranches, id] });
    }
  };

  // 2. Data Table Logic (Standard 4 Years)
  const rows = [
    { label: "1st Year", key: "1" },
    { label: "2nd Year", key: "2" },
    { label: "3rd Year", key: "3" },
    { label: "4th Year", key: "4" },
  ];

  const updateData = (rowKey, field, val) => {
    setEngFields({ ...engFields, [`${field}_${rowKey}`]: val });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTION A: BRANCH SELECTION */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        {/* Header with Select All Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Select Branches (For Syllabus Pages)
          </h3>
          
          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            {/* Custom Checkbox UI */}
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              isAllSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
            }`}>
              {isAllSelected && <Check size={12} className="text-white" />}
            </div>
            Select All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ENGINEERING_BRANCHES.map(b => {
            const isSelected = selectedBranches.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBranch(b.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {b.label}
                {isSelected && <Check size={16} className="ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION B: FINANCIAL DATA (Standard 4 Years) */}
      <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-32">Year</th>
              <th className="px-4 py-4">Student Count</th>
              <th className="px-4 py-4">Training Hrs</th>
              <th className="px-4 py-4">Cost / Student</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-bold text-slate-700 bg-slate-50/50 border-r border-slate-100">
                  {row.label}
                </td>
                <td className="px-4 py-3">
                  <TableInput
                    value={engFields[`studentCount_${row.key}`] || ''}
                    onChange={(e) => updateData(row.key, 'studentCount', e.target.value)}
                  />
                </td>
                <td className="px-4 py-3">
                  <TableInput
                    value={engFields[`hours_${row.key}`] || ''}
                    onChange={(e) => updateData(row.key, 'hours', e.target.value)}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={engFields[`cost_${row.key}`] || ''}
                    onChange={(e) => updateData(row.key, 'cost', e.target.value)}
                    placeholder="₹"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}