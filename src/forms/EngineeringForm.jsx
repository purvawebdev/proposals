import React from "react";

// --- Internal Helper for Table Inputs ---
const TableInput = ({ value, onChange, placeholder, type = "number" }) => (
  <input
    type={type}
    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
    placeholder={placeholder || "0"}
    value={value}
    onChange={onChange}
  />
);

export default function EngineeringForm({ engFields, setEngFields }) {
  const rows = [
    { year: "1st Year", key: "1" }, // Changed key to '1' to match your PDF logic (studentCount_1)
    { year: "2nd Year", key: "2" },
    { year: "3rd Year", key: "3" },
    { year: "4th Year", key: "4" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 w-32">Year</th>
              <th className="px-4 py-4">Student Count</th>
              <th className="px-4 py-4">Cost per Student</th>
              <th className="px-4 py-4">Training Hrs</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.key} className="group hover:bg-gray-50/50 transition-colors">
                
                {/* Year Label */}
                <td className="px-6 py-4 font-bold text-gray-700 border-r border-gray-100 bg-gray-50/30">
                  {row.year}
                </td>

                {/* Student Count */}
                <td className="px-4 py-3">
                  <TableInput
                    value={engFields[`studentCount_${row.key}`] || ""}
                    onChange={(e) =>
                      setEngFields({
                        ...engFields,
                        [`studentCount_${row.key}`]: e.target.value,
                      })
                    }
                    placeholder="Count"
                  />
                </td>

                {/* Cost (Text type allowed for symbols) */}
                <td className="px-4 py-3">
                  <TableInput
                    type="text"
                    value={engFields[`cost_${row.key}`] || ""}
                    onChange={(e) =>
                      setEngFields({
                        ...engFields,
                        [`cost_${row.key}`]: e.target.value,
                      })
                    }
                    placeholder="₹ Cost"
                  />
                </td>

                {/* Training Hours */}
                <td className="px-4 py-3">
                  <TableInput
                    value={engFields[`hours_${row.key}`] || ""}
                    onChange={(e) =>
                      setEngFields({
                        ...engFields,
                        [`hours_${row.key}`]: e.target.value,
                      })
                    }
                    placeholder="Hrs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Hint */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Enter the details for each engineering year.
          </p>
        </div>
      </div>
    </div>
  );
}