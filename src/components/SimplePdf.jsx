import React, { useState } from "react";
import jsPDF from "jspdf";

import MBAForm from "../forms/MBAForm";
import EngineeringForm from "../forms/EngineeringForm";
import CommonFields from "../fields/CommonFields";

export default function SimplePdfGenerator({ pageSets }) {
  const [domain, setDomain] = useState("mba");
  const pages = pageSets[domain] || [];

  const [collegeName, setCollegeName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  // MBA Fields
  const [tableFields, setTableFields] = useState({
    studentCount_1_1: "",
    trainingHrs_1_1: "",
    studentCount_1_2: "",
    trainingHrs_1_2: "",
    cost_1: "",

    studentCount_2_1: "",
    trainingHrs_2_1: "",
    cost_2: "",
  });

  // Engineering Fields
  const [engFields, setEngFields] = useState({
    cse_students: "",
    cse_hours: "",
    cse_cost: "",
  });

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  // domain-specific coordinates (px)
  // Tweak these numbers after testing with your actual background images.
  // Format:
  // coords[domain] = {
  //   college: { x, y, fontSize },
  //   logo: { x, y, width, height },
  //   table: { // for "table" page: rows = array of y positions, columns = x positions
  //     cols: { studentX, costX, hoursX }, rows: [y1, y2, y3, y4]
  //   }
  // }

  const generate = async () => {
    try {
      setLoading(true);

      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;
      // DOMAIN-SPECIFIC COORDS + FONTS
      const coords = {
        mba: {
          college: {
            x: 56,
            y: 320,
            fontSize: 20,
            fontName: "times",
            fontStyle: "bold",
          },

          logo: {
            x: 595 - 220 - 40, // PAGE_WIDTH - logoWidth - margin
            y: 842 - 130 - 40, // PAGE_HEIGHT - logoHeight - margin
            width: 220,
            height: 130,
          },

          table: {
            fontName: "times",
            fontStyle: "normal",
            fontSize: 15,

            cols: { studentX: 280, hrsX: 380, costX: 490 },
            rows: [540, 565, 592],
            cost1Y: 550, // cost lies between row 1 & 2
          },
        },

        engineering: {
          college: {
            x: 13,
            y: 380,
            fontSize: 18,
            fontName: "helvetica",
            fontStyle: "bold",
          },

          logo: {
            x: 13, // adjust after checking image
            y: 590,
            width: 150,
            height: 150,
          },

          table: {
            fontName: "helvetica",
            fontStyle: "normal",
            fontSize: 15,

            cols: { studentX: 170, costX: 300, hoursX: 515 },
            rows: [203, 218, 233, 250], // 1st, 2nd, 3rd, 4th year
          },
        },
      };

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_WIDTH, PAGE_HEIGHT],
      });

      // ensure pages exist
      if (!pages || pages.length === 0) {
        alert("No pages available for selected domain.");
        setLoading(false);
        return;
      }

      for (let i = 0; i < pages.length; i++) {
        const { bg, editable } = pages[i];
        const bgImg = await loadImage(bg);

        if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        pdf.addImage(bgImg, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

        const c = coords[domain] || coords.mba; // fallback to mba if domain missing

        // PAGE with college name + logo
        if (editable === true) {
          // college
          const cx = c.college.x;
          const cy = c.college.y;
          const cFont = c.college.fontSize || 18;

          if (domain === "engineering") {
            pdf.setTextColor("#fff"); // deep blue (looks premium)
          } else {
            pdf.setTextColor(0, 0, 0); // MBA stays BLACK
          }
          try {
            pdf.setFont("Times", "bold");
          } catch {
            if (pdf.setFontType) pdf.setFontType("bold");
          }
          pdf.setFontSize(cFont);
          const splitText = pdf.splitTextToSize(
            collegeName || " ",
            PAGE_WIDTH - cx - 300
          );
          pdf.text(splitText, cx, cy);

          // logo (if uploaded)
          if (logo) {
            const logoImg = await loadImage(logo);
            const lx = c.logo.x;
            const ly = c.logo.y;
            const lw = c.logo.width;
            const lh = c.logo.height;
            pdf.addImage(logoImg, "PNG", lx, ly, lw, lh);
          }
        }

        // TABLE page (domain-aware)
        if (editable === "table") {
          pdf.setFontSize(15);
          pdf.setTextColor(0, 0, 0);

          if (domain === "mba") {
            const t = c.table;
            // row 1 (1st year 1st sem)
            pdf.text(
              tableFields.studentCount_1_1 || "",
              t.cols.studentX,
              t.rows[0]
            );
            pdf.text(tableFields.trainingHrs_1_1 || "", t.cols.hrsX, t.rows[0]);

            // row 2 (1st year 2nd sem)
            pdf.text(
              tableFields.studentCount_1_2 || "",
              t.cols.studentX,
              t.rows[1]
            );
            pdf.text(tableFields.trainingHrs_1_2 || "", t.cols.hrsX, t.rows[1]);

            // cost for 1st year (rowspan)
            pdf.text(
              tableFields.cost_1 || tableFields.cost_1_1 || "",
              t.cols.costX,
              t.cost1Y || t.rows[0] + 10
            );

            // row 3 (2nd year 2nd sem)
            pdf.text(
              tableFields.studentCount_2_1 || "",
              t.cols.studentX,
              t.rows[2]
            );
            pdf.text(tableFields.trainingHrs_2_1 || "", t.cols.hrsX, t.rows[2]);
            pdf.text(
              tableFields.cost_2 || tableFields.cost_2_1 || "",
              t.cols.costX,
              t.rows[2]
            );
          }

          if (domain === "engineering") {
            const t = c.table;
            // iterate rows (4 years)
            const rows = t.rows;
            for (let r = 0; r < rows.length; r++) {
              const y = rows[r];
              // keys in engFields should follow: studentCount_y1, cost_y1, hours_y1 etc.
              const suffix = `y${r + 1}`;
              const studentVal =
                (engFields &&
                  (engFields[`studentCount_${suffix}`] ??
                    engFields[`studentCount_${r + 1}`] ??
                    engFields[`studentCount_y${r + 1}`] ??
                    "")) ||
                "";
              const costVal =
                (engFields &&
                  (engFields[`cost_${suffix}`] ??
                    engFields[`cost_${r + 1}`] ??
                    "")) ||
                "";
              const hoursVal =
                (engFields &&
                  (engFields[`hours_${suffix}`] ??
                    engFields[`hours_${r + 1}`] ??
                    "")) ||
                "";

              pdf.text(String(studentVal), t.cols.studentX, y);
              pdf.text(String(costVal), t.cols.costX, y);
              pdf.text(String(hoursVal), t.cols.hoursX, y);
            }
          }
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Proposal PDF Generator</h2>

      {/* Domain (MBA / Engineering) */}
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

      {/* Common Fields */}
      <CommonFields
        collegeName={collegeName}
        setCollegeName={setCollegeName}
        logo={logo}
        handleLogoUpload={handleLogoUpload}
      />

      {/* Domain Specific Forms */}
      {domain === "mba" && (
        <MBAForm tableFields={tableFields} setTableFields={setTableFields} />
      )}

      {domain === "engineering" && (
        <EngineeringForm engFields={engFields} setEngFields={setEngFields} />
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
      >
        {loading ? "Generating..." : "Generate PDF"}
      </button>
    </div>
  );
}
