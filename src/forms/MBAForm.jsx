export default function MBAForm({ tableFields, setTableFields }) {
  return (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Year</th>
            <th className="border p-3 text-left">Sem</th>
            <th className="border p-3 text-left">Student Count</th>
            <th className="border p-3 text-left">Training Hrs</th>
            <th className="border p-3 text-left">Cost per Student</th>
          </tr>
        </thead>

        <tbody>
          {/* 1st Year MBA - 1st Sem */}
          <tr>
            <td rowSpan="2" className="border p-3 font-medium">
              1st Year - MBA
            </td>
            <td className="border p-3">1st Sem</td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Count"
                value={tableFields.studentCount_1_1}
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    studentCount_1_1: e.target.value,
                  })
                }
              />
            </td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Hrs"
                value={tableFields.trainingHrs_1_1}
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    trainingHrs_1_1: e.target.value,
                  })
                }
              />
            </td>

            <td rowSpan="2" className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Cost"
                value={tableFields.cost_1}
                onChange={(e) =>
                  setTableFields({ ...tableFields, cost_1: e.target.value })
                }
              />
            </td>
          </tr>

          {/* 1st Year MBA - 2nd Sem */}
          <tr>
            <td className="border p-3">2nd Sem</td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                value={tableFields.studentCount_1_2}
                placeholder="Count"
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    studentCount_1_2: e.target.value,
                  })
                }
              />
            </td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                value={tableFields.trainingHrs_1_2}
                placeholder="Hrs"
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    trainingHrs_1_2: e.target.value,
                  })
                }
              />
            </td>
          </tr>

          {/* 2nd Year MBA - 2nd Sem */}
          <tr>
            <td className="border p-3 font-medium">2nd Year - MBA</td>
            <td className="border p-3">2nd Sem</td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Count"
                value={tableFields.studentCount_2_1}
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    studentCount_2_1: e.target.value,
                  })
                }
              />
            </td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Hrs"
                value={tableFields.trainingHrs_2_1}
                onChange={(e) =>
                  setTableFields({
                    ...tableFields,
                    trainingHrs_2_1: e.target.value,
                  })
                }
              />
            </td>

            <td className="border p-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Cost"
                value={tableFields.cost_2}
                onChange={(e) =>
                  setTableFields({ ...tableFields, cost_2: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
