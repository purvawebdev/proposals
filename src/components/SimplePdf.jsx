import React, { useState } from "react";
import jsPDF from "jspdf";

import MBAForm from "../forms/MBAForm";
import EngineeringForm from "../forms/EngineeringForm";
import CommonFields from "../fields/CommonFields";

export default function SimplePdfGenerator({ pageSets }) {
  const [domain, setDomain] = useState("mba");


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

  // ⭐ Auto-scale Logo Helper
  function scaleImageToFit(img, maxW, maxH) {
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    return {
      width: img.naturalWidth * ratio,
      height: img.naturalHeight * ratio,
    };
  }

  const generate = async () => {
    try {
      setLoading(true);

      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;

      // 1. LOGIC: Determine Active Domain based on Dropdown
      let activeDomain = domain;
      if (domain === "mba") {
        const sel = tableFields.selectedYear;
        if (sel === "1") activeDomain = "mba_1"; // Uses pageSets.mba_1
        if (sel === "2") activeDomain = "mba_2"; // Uses pageSets.mba_2
      }

      // 2. LOGIC: Define Coordinates for all 3 scenarios
      const coords = {
        // DEFAULT MBA (Both Years)
        mba: {
          college: {
            x: 56,
            y: 320,
            fontSize: 20,
            fontName: "helvetica",
            fontStyle: "bold",
          },
          logo: { x: 345, y: 672, maxWidth: 220, maxHeight: 130 },
          table: {
            fontName: "times",
            fontStyle: "normal",
            fontSize: 15,
            cols: { studentX: 250, hrsX: 350, costX: 440 },
            rows: [565, 605, 640], // 3 Rows
            cost1Y: 589,
          },
        },

        // MBA YEAR 1 ONLY
        mba_year1: {
          college: {
            x: 56,
            y: 320,
            fontSize: 20,
            fontName: "helvetica",
            fontStyle: "bold",
          },
          logo: { x: 345, y: 672, maxWidth: 220, maxHeight: 130 },
          table: {
            fontName: "times",
            fontStyle: "normal",
            fontSize: 15,
            cols: { studentX: 250, hrsX: 350, costX: 440 },
            rows: [410, 450], // ⭐ Adjust these Y-values for your 8_1.jpg
            cost1Y: 430,
          },
        },

        // MBA YEAR 2 ONLY
        mba_year2: {
          college: {
            x: 56,
            y: 320,
            fontSize: 20,
            fontName: "helvetica",
            fontStyle: "bold",
          },
          logo: { x: 345, y: 672, maxWidth: 220, maxHeight: 130 },
          table: {
            fontName: "times",
            fontStyle: "normal",
            fontSize: 15,
            cols: { studentX: 250, hrsX: 350, costX: 450 },
            rows: [200], // ⭐ Adjust these Y-values for your 8_2.jpg
            cost1Y: 200,
          },
        },

        // ENGINEERING
        engineering: {
          college: {
            x: 13,
            y: 380,
            fontSize: 20,
            fontName: "helvetica",
            fontStyle: "bold",
          },
          logo: { x: 13, y: 620, maxWidth: 200, maxHeight: 200 },
          table: {
            fontName: "helvetica",
            fontStyle: "normal",
            fontSize: 15,
            cols: { studentX: 170, costX: 250, hoursX: 515 },
            rows: [203, 218, 233, 250],
          },
        },
      };

      // 3. LOGIC: Select the correct list of pages
      // Note: Make sure your App.js passes 'mba_1' and 'mba_2' in pageSets!
      const pagesToPrint = pageSets[activeDomain] || [];

      if (pagesToPrint.length === 0) {
        alert(`No pages found for ${activeDomain}. Check your pageSets data.`);
        setLoading(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_WIDTH, PAGE_HEIGHT],
      });

      for (let i = 0; i < pagesToPrint.length; i++) {
        const { bg, editable } = pagesToPrint[i];
        const bgImg = await loadImage(bg);

        if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        pdf.addImage(bgImg, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

        // Get coords for the ACTIVE domain (mba, mba_year1, or mba_year2)
        // Note: We map activeDomain 'mba_1' -> coords 'mba_year1' for clarity if needed,
        // or just use consistent naming. Here I map them:
        let c;
        if (activeDomain === "mba_1") c = coords.mba_year1;
        else if (activeDomain === "mba_2") c = coords.mba_year2;
        else c = coords[activeDomain] || coords.mba;

        // --- PAGE 1 LOGIC (College & Logo) ---
        if (editable === true) {
          const cx = c.college.x;
          const cy = c.college.y;

          pdf.setTextColor(domain === "engineering" ? "#fff" : "#000");

          try {
            pdf.setFont(c.college.fontName, c.college.fontStyle);
          } catch {
            if (pdf.setFontType) pdf.setFontType(c.college.fontStyle);
          }

          pdf.setFontSize(c.college.fontSize);
          const splitText = pdf.splitTextToSize(
            collegeName || " ",
            PAGE_WIDTH - cx - 300
          );
          pdf.text(splitText, cx, cy);

          if (logo) {
            const logoImg = await loadImage(logo);
            const scaled = scaleImageToFit(
              logoImg,
              c.logo.maxWidth,
              c.logo.maxHeight
            );
            pdf.addImage(
              logoImg,
              "PNG",
              c.logo.x,
              c.logo.y,
              scaled.width,
              scaled.height
            );
          }
        }

        // --- TABLE LOGIC ---
        if (editable === "table") {
          pdf.setFontSize(15);
          pdf.setTextColor(0, 0, 0);
          const t = c.table;

          // LOGIC FOR MBA 1st YEAR ONLY
          if (activeDomain === "mba_1") {
            // 1st Sem
            pdf.text(
              tableFields.studentCount_1_1 || "",
              t.cols.studentX,
              t.rows[0]
            );
            pdf.text(tableFields.trainingHrs_1_1 || "", t.cols.hrsX, t.rows[0]);
            // 2nd Sem
            pdf.text(
              tableFields.studentCount_1_2 || "",
              t.cols.studentX,
              t.rows[1]
            );
            pdf.text(tableFields.trainingHrs_1_2 || "", t.cols.hrsX, t.rows[1]);
            // Cost
            pdf.text(tableFields.cost_1 || "", t.cols.costX, t.cost1Y);
          }

          // LOGIC FOR MBA 2nd YEAR ONLY
          else if (activeDomain === "mba_2") {
            // 3rd Sem (Row 0 on this page)
            pdf.text(
              tableFields.studentCount_2_1 || "",
              t.cols.studentX,
              t.rows[0]
            );
            pdf.text(tableFields.trainingHrs_2_1 || "", t.cols.hrsX, t.rows[0]);
            // Cost
            pdf.text(tableFields.cost_2 || "", t.cols.costX, t.cost1Y);
          }

          // LOGIC FOR MBA (Both Years / Default)
          else if (activeDomain === "mba") {
            pdf.text(
              tableFields.studentCount_1_1 || "",
              t.cols.studentX,
              t.rows[0]
            );
            pdf.text(tableFields.trainingHrs_1_1 || "", t.cols.hrsX, t.rows[0]);

            pdf.text(
              tableFields.studentCount_1_2 || "",
              t.cols.studentX,
              t.rows[1]
            );
            pdf.text(tableFields.trainingHrs_1_2 || "", t.cols.hrsX, t.rows[1]);
            pdf.text(tableFields.cost_1 || "", t.cols.costX, t.cost1Y);

            pdf.text(
              tableFields.studentCount_2_1 || "",
              t.cols.studentX,
              t.rows[2]
            );
            pdf.text(tableFields.trainingHrs_2_1 || "", t.cols.hrsX, t.rows[2]);
            pdf.text(tableFields.cost_2 || "", t.cols.costX, t.rows[2]);
          }

          // LOGIC FOR ENGINEERING
          else if (activeDomain === "engineering") {
            const rows = t.rows;
            for (let r = 0; r < rows.length; r++) {
              const y = rows[r];
              const suffix = `y${r + 1}`;
              const studentVal =
                engFields[`studentCount_${suffix}`] ??
                engFields[`studentCount_${r + 1}`] ??
                "";
              const costVal =
                engFields[`cost_${suffix}`] ?? engFields[`cost_${r + 1}`] ?? "";
              const hoursVal =
                engFields[`hours_${suffix}`] ??
                engFields[`hours_${r + 1}`] ??
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

      <CommonFields
        collegeName={collegeName}
        setCollegeName={setCollegeName}
        logo={logo}
        handleLogoUpload={handleLogoUpload}
      />

      {domain === "mba" && (
        <MBAForm tableFields={tableFields} setTableFields={setTableFields} />
      )}

      {domain === "engineering" && (
        <EngineeringForm engFields={engFields} setEngFields={setEngFields} />
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
      >
        {loading ? "Generating..." : "Generate PDF"}
      </button>
    </div>
  );
}
