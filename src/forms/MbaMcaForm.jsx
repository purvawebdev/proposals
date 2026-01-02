import React from "react";

const TableInput = ({ value, onChange, placeholder, type = "number" }) => (
  <input
    type={type}
    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
    placeholder={placeholder || "0"}
    value={value}
    onChange={onChange}
  />
);

export default function MbaMcaForm({ mbaMcaFields, setMbaMcaFields }) {
  
  const handleChange = (key, value) => {
    setMbaMcaFields({ ...mbaMcaFields, [key]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3 border border-gray-300 font-bold w-48 text-center">Department / Sem</th>
              <th className="px-4 py-3 border border-gray-300 font-semibold text-center">Student Count</th>
              <th className="px-4 py-3 border border-gray-300 font-semibold text-center">Training Hrs</th>
              <th className="px-4 py-3 border border-gray-300 font-semibold text-center bg-gray-50">Cost / Student (Total)</th>
            </tr>
          </thead>

          <tbody>
            
            {/* --- MBA SECTION HEADER --- */}
            <tr className="bg-indigo-50/80">
              <td colSpan={4} className="px-3 py-1.5 border border-gray-300 font-bold text-indigo-800 text-center uppercase tracking-wide text-[10px]">
                MBA Department
              </td>
            </tr>
            
            {/* MBA 1st Year - Sem 1 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MBA 1st Year (Sem 1)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_1_1_count} onChange={(e) => handleChange("mba_1_1_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_1_1_hours} onChange={(e) => handleChange("mba_1_1_hours", e.target.value)} /></td>
              
              {/* MERGED COST CELL (Rowspan 2) */}
              <td className="px-4 py-3 border border-gray-300 bg-white align-middle relative" rowSpan={2}>
                <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wider pointer-events-none">Year 1 Total</div>
                <div className="flex items-center justify-center h-full pt-4">
                    <TableInput type="text" placeholder="₹ Total Cost" value={mbaMcaFields.mba_year1_cost} onChange={(e) => handleChange("mba_year1_cost", e.target.value)} />
                </div>
              </td>
            </tr>

            {/* MBA 1st Year - Sem 2 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MBA 1st Year (Sem 2)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_1_2_count} onChange={(e) => handleChange("mba_1_2_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_1_2_hours} onChange={(e) => handleChange("mba_1_2_hours", e.target.value)} /></td>
              {/* Cost cell hidden due to rowSpan */}
            </tr>

            {/* MBA 2nd Year - Sem 3 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MBA 2nd Year (Sem 3)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_2_1_count} onChange={(e) => handleChange("mba_2_1_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mba_2_1_hours} onChange={(e) => handleChange("mba_2_1_hours", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300 bg-white"><TableInput type="text" placeholder="₹ Cost" value={mbaMcaFields.mba_2_1_cost} onChange={(e) => handleChange("mba_2_1_cost", e.target.value)} /></td>
            </tr>


            {/* --- MCA SECTION HEADER --- */}
            <tr className="bg-emerald-50/80">
              <td colSpan={4} className="px-3 py-1.5 border border-gray-300 font-bold text-emerald-800 text-center uppercase tracking-wide text-[10px]">
                MCA Department
              </td>
            </tr>

            {/* MCA 1st Year - Sem 1 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MCA 1st Year (Sem 1)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_1_1_count} onChange={(e) => handleChange("mca_1_1_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_1_1_hours} onChange={(e) => handleChange("mca_1_1_hours", e.target.value)} /></td>
              
              {/* MERGED COST CELL (Rowspan 2) */}
              <td className="px-4 py-3 border border-gray-300 bg-white align-middle relative" rowSpan={2}>
                <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wider pointer-events-none">Year 1 Total</div>
                <div className="flex items-center justify-center h-full pt-4">
                    <TableInput type="text" placeholder="₹ Total Cost" value={mbaMcaFields.mca_year1_cost} onChange={(e) => handleChange("mca_year1_cost", e.target.value)} />
                </div>
              </td>
            </tr>

            {/* MCA 1st Year - Sem 2 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MCA 1st Year (Sem 2)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_1_2_count} onChange={(e) => handleChange("mca_1_2_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_1_2_hours} onChange={(e) => handleChange("mca_1_2_hours", e.target.value)} /></td>
              {/* Cost cell hidden due to rowSpan */}
            </tr>

            {/* MCA 2nd Year - Sem 3 */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 border border-gray-300 font-medium text-gray-800 bg-gray-50/30">MCA 2nd Year (Sem 3)</td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_2_1_count} onChange={(e) => handleChange("mca_2_1_count", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300"><TableInput value={mbaMcaFields.mca_2_1_hours} onChange={(e) => handleChange("mca_2_1_hours", e.target.value)} /></td>
              <td className="px-4 py-3 border border-gray-300 bg-white"><TableInput type="text" placeholder="₹ Cost" value={mbaMcaFields.mca_2_1_cost} onChange={(e) => handleChange("mca_2_1_cost", e.target.value)} /></td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
//gotta change the coords of mca pages in simpleform will do that later