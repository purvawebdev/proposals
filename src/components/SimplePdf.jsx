import React from "react";
import { useState } from "react";
import jsPDF from "jspdf";

/*
  SimplePdfGenerator:
  - uses /templates/image1.png as page background
  - form with one field: collegeName
  - generates and downloads single-page PDF
*/

export default function SimplePdfGenerator({ pageSets }) {
  const [collegeName, setCollegeName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [domain, setDomain] = useState("mba");
  const pages = pageSets[domain];

  const [tableFields, setTableFields] = useState({
    studentCount_1_1: "",
    trainingHrs_1_1: "",
    cost_1_1: "",

    studentCount_1_2: "",
    trainingHrs_1_2: "",
    // cost_1_2: "",

    studentCount_2_1: "",
    trainingHrs_2_1: "",
    cost_2_1: "",
  });

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result); // dataURL
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    try {
      setLoading(true);

      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_WIDTH, PAGE_HEIGHT],
      });

      for (let i = 0; i < pages.length; i++) {
        const { bg, editable } = pages[i];

        const bgImg = await loadImage(bg);

        if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

        pdf.addImage(bgImg, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

        // Only first page is editable
        if (editable === true) {
          const x = 56;
          const y = 320;
          const fontSize = 20;

          try {
            pdf.setFont("Times", "bold");
          } catch (e) {
            if (pdf.setFontType) pdf.setFontType("bold");
            console.log("Font setting error:", e);
          }

          pdf.setFontSize(fontSize);

          const splitText = pdf.splitTextToSize(
            collegeName || " ",
            PAGE_WIDTH - x - 200
          );
          pdf.text(splitText, x, y);

          if (logo) {
            const logoImg = await loadImage(logo);

            const logoWidth = 220;
            const logoHeight = 130;

            const lx = PAGE_WIDTH - logoWidth - 40;
            const ly = PAGE_HEIGHT - logoHeight - 40;

            pdf.addImage(logoImg, "PNG", lx, ly, logoWidth, logoHeight);
          }
        }
        if (editable === "table") {
          pdf.setFontSize(15);

          // Coordinates must match your template precisely:
          pdf.text(tableFields.studentCount_1_1 || "", 280, 540);
          pdf.text(tableFields.trainingHrs_1_1 || "", 380, 540);
          pdf.text(tableFields.cost_1_1 || "", 490, 550);

          pdf.text(tableFields.studentCount_1_2 || "", 280, 565); //these fiekds are correct
          pdf.text(tableFields.trainingHrs_1_2 || "", 380, 565); //dc
          //pdf.text(tableFields.cost_1_2 || "", 490, 565); //dc

          pdf.text(tableFields.studentCount_2_1 || "", 280, 592);
          pdf.text(tableFields.trainingHrs_2_1 || "", 380, 592);
          pdf.text(tableFields.cost_2_1 || "", 490, 592);
          // Adjust X and Y based on your table layout
        }
      }

      pdf.save("proposal.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Proposal PDF Generator
      </h2>
<div className="mb-6">
          <label className="block font-semibold mb-2">Select Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="mba">MBA</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>

      {/* College Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          College Name
        </label>
        <input
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="Enter college name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">
          Upload College Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-full text-sm border p-2 rounded-lg cursor-pointer bg-gray-50"
        />

        {logo && (
          <img
            src={logo}
            alt="Logo preview"
            className="w-32 mt-4 rounded border shadow-sm"
          />
        )}
      </div>

      {/* TABLE SECTION */}
      <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">
        Training & Placement Table (Page 6)
      </h3>

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
                  value={tableFields.cost_1_1}
                  onChange={(e) =>
                    setTableFields({ ...tableFields, cost_1_1: e.target.value })
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

              {/* <td className="border p-3">
          <input
            className="w-full border p-2 rounded"
            value={tableFields.cost_1_2}
            placeholder="Cost"
            onChange={(e) =>
              setTableFields({ ...tableFields, cost_1_2: e.target.value })
            }
          />
        </td> */}
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
                  value={tableFields.cost_2_1}
                  onChange={(e) =>
                    setTableFields({ ...tableFields, cost_2_1: e.target.value })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BUTTON */}
      <button
        onClick={generate}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate PDF"}
      </button>
    </div>
  );
}
