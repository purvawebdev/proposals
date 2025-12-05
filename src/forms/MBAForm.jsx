import React from "react";
import { ChevronDown, Calendar } from "lucide-react";

// --- Internal Helper for Table Inputs ---
const TableInput = ({ value, onChange, placeholder }) => (
  <input
    type="type"
    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
    placeholder={placeholder || "0"}
    value={value}
    onChange={onChange}
  />
);

export default function MBAForm({ tableFields, setTableFields }) {
  const selectedYear = tableFields.selectedYear || "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Year Selection Card */}
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 text-indigo-700 min-w-max">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Calendar size={18} />
          </div>
          <span className="font-semibold text-sm">Configuration Mode</span>
        </div>
        
        <div className="relative w-full">
          <select
            value={selectedYear}
            onChange={(e) =>
              setTableFields({ ...tableFields, selectedYear: e.target.value })
            }
            className="w-full appearance-none px-4 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="">-- Select Year to Edit --</option>
            <option value="1">1st Year Only</option>
            <option value="2">2nd Year Only</option>
            <option value="both">Both Years (1st & 2nd)</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* 2. Data Table */}
      {selectedYear && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-4 py-4 w-24">Year</th>
                <th className="px-4 py-4 w-24">Sem</th>
                <th className="px-4 py-4">Student Count</th>
                <th className="px-4 py-4">Training Hrs</th>
                <th className="px-4 py-4">Cost / Student</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              
              {/* --- 1st YEAR Logic --- */}
              {(selectedYear === "1" || selectedYear === "both") && (
                <>
                  {/* Row 1: 1st Sem */}
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td
                      rowSpan="2"
                      className="px-4 py-4 font-bold text-gray-800 border-r border-gray-100 bg-gray-50/30 align-middle"
                    >
                      1st Year
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-600">1st Sem</td>

                    <td className="px-4 py-3">
                      <TableInput
                        value={tableFields.studentCount_1_1 || ""}
                        onChange={(e) => setTableFields({ ...tableFields, studentCount_1_1: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <TableInput
                        value={tableFields.trainingHrs_1_1 || ""}
                        onChange={(e) => setTableFields({ ...tableFields, trainingHrs_1_1: e.target.value })}
                      />
                    </td>
                    <td rowSpan="2" className="px-4 py-3 align-middle bg-gray-50/30">
                      <TableInput
                        value={tableFields.cost_1 || ""}
                        onChange={(e) => setTableFields({ ...tableFields, cost_1: e.target.value })}
                        placeholder="₹ Total"
                      />
                    </td>
                  </tr>

                  {/* Row 2: 2nd Sem */}
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-600 border-l border-gray-100 sm:border-l-0">2nd Sem</td>
                    <td className="px-4 py-3">
                      <TableInput
                        value={tableFields.studentCount_1_2 || ""}
                        onChange={(e) => setTableFields({ ...tableFields, studentCount_1_2: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <TableInput
                        value={tableFields.trainingHrs_1_2 || ""}
                        onChange={(e) => setTableFields({ ...tableFields, trainingHrs_1_2: e.target.value })}
                      />
                    </td>
                  </tr>
                </>
              )}

              {/* --- 2nd YEAR Logic --- */}
              {(selectedYear === "2" || selectedYear === "both") && (
                <tr className="group hover:bg-gray-50/50 transition-colors border-t-2 border-gray-100">
                  <td className="px-4 py-4 font-bold text-gray-800 border-r border-gray-100 bg-gray-50/30">
                    2nd Year
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-600">3rd Sem</td>

                  <td className="px-4 py-3">
                    <TableInput
                      value={tableFields.studentCount_2_1 || ""}
                      onChange={(e) => setTableFields({ ...tableFields, studentCount_2_1: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TableInput
                      value={tableFields.trainingHrs_2_1 || ""}
                      onChange={(e) => setTableFields({ ...tableFields, trainingHrs_2_1: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TableInput
                      value={tableFields.cost_2 || ""}
                      onChange={(e) => setTableFields({ ...tableFields, cost_2: e.target.value })}
                      placeholder="₹ Total"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Empty State / Footer hint */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
             <p className="text-xs text-gray-500 text-center">
                Fill in the details for the selected semesters.
             </p>
          </div>
        </div>
      )}

      {!selectedYear && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
          <p className="text-sm">Please select a year configuration above to view the table.</p>
        </div>
      )}
    </div>
  );
}