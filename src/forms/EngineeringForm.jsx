export default function EngineeringForm({ engFields, setEngFields }) {
  return (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Year</th>
            <th className="border p-3 text-left">Student Count</th>
            <th className="border p-3 text-left">Cost per Student</th>
            <th className="border p-3 text-left">Training Hrs</th>
          </tr>
        </thead>

        <tbody>
          {/* Row Template */}
          {[
            { year: "1st Year", key: "y1" },
            { year: "2nd Year", key: "y2" },
            { year: "3rd Year", key: "y3" },
            { year: "4th Year", key: "y4" },
          ].map((row) => (
            <tr key={row.key}>
              <td className="border p-3 font-medium">{row.year}</td>

              {/* Student Count */}
              <td className="border p-3">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Count"
                  value={engFields[`studentCount_${row.key}`] || ""}
                  onChange={(e) =>
                    setEngFields({
                      ...engFields,
                      [`studentCount_${row.key}`]: e.target.value,
                    })
                  }
                />
              </td>

              {/* Cost */}
              <td className="border p-3">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Cost"
                  value={engFields[`cost_${row.key}`] || ""}
                  onChange={(e) =>
                    setEngFields({
                      ...engFields,
                      [`cost_${row.key}`]: e.target.value,
                    })
                  }
                />
              </td>

              
              {/* Training Hrs */}
              <td className="border p-3">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Hrs"
                  value={engFields[`hours_${row.key}`] || ""}
                  onChange={(e) =>
                    setEngFields({
                      ...engFields,
                      [`hours_${row.key}`]: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
