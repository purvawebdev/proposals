// services/pdfGenerationService.js
import { DOMAINS, COORDINATES, PAGE_DIMENSIONS } from '../constants/pdfConstants';

export class PdfGenerationService {
  static loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  static scaleImageToFit(img, maxW, maxH) {
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    return {
      width: img.naturalWidth * ratio,
      height: img.naturalHeight * ratio,
    };
  }

  static determineActiveDomain(domain, tableFields) {
    if (domain === DOMAINS.MBA) {
      const selectedYear = tableFields.selectedYear;
      if (selectedYear === "1") return DOMAINS.MBA_1;
      if (selectedYear === "2") return DOMAINS.MBA_2;
    }
    return domain;
  }

  static getCoordinatesForDomain(activeDomain) {
    if (activeDomain === DOMAINS.MBA_1) return COORDINATES.mba_year1;
    if (activeDomain === DOMAINS.MBA_2) return COORDINATES.mba_year2;
    return COORDINATES[activeDomain] || COORDINATES.mba;
  }

  static async renderCollegeAndLogo(pdf, collegeName, logo, coordinates, domain) {
    const cx = coordinates.college.x;
    const cy = coordinates.college.y;

    pdf.setTextColor(domain === DOMAINS.ENGINEERING ? "#fff" : "#000");
    
    try {
      pdf.setFont(coordinates.college.fontName, coordinates.college.fontStyle);
    } catch {
      if (pdf.setFontType) pdf.setFontType(coordinates.college.fontStyle);
    }
    
    pdf.setFontSize(coordinates.college.fontSize);
    
    const splitText = pdf.splitTextToSize(
      collegeName || " ",
      PAGE_DIMENSIONS.WIDTH - cx - 300
    );
    pdf.text(splitText, cx, cy);

    if (logo) {
      const logoImg = await PdfGenerationService.loadImage(logo);
      const scaled = PdfGenerationService.scaleImageToFit(
        logoImg,
        coordinates.logo.maxWidth,
        coordinates.logo.maxHeight
      );
      pdf.addImage(
        logoImg,
        "PNG",
        coordinates.logo.x,
        coordinates.logo.y,
        scaled.width,
        scaled.height
      );
    }
  }

  static renderTableData(pdf, coordinates, activeDomain, formData) {
    pdf.setFontSize(15);
    pdf.setTextColor(0, 0, 0);
    const table = coordinates.table;

    switch (activeDomain) {
      case DOMAINS.MBA_1:
        this.renderMbaYear1Table(pdf, table, formData.tableFields);
        break;
      case DOMAINS.MBA_2:
        this.renderMbaYear2Table(pdf, table, formData.tableFields);
        break;
      case DOMAINS.MBA:
        this.renderMbaTable(pdf, table, formData.tableFields);
        break;
      case DOMAINS.ENGINEERING:
        this.renderEngineeringTable(pdf, table, formData.engFields);
        break;
      case DOMAINS.MBA_MCA:
        this.renderMbaMcaTable(pdf, table, formData.mbaMcaFields);
        break;
    }
  }

  static renderMbaYear1Table(pdf, table, tableFields) {
    // Sem 1
    pdf.text(tableFields.studentCount_1_1 || "", table.cols.studentX, table.rows[0]);
    pdf.text(tableFields.trainingHrs_1_1 || "", table.cols.hrsX, table.rows[0]);
    
    // Sem 2  
    pdf.text(tableFields.studentCount_1_2 || "", table.cols.studentX, table.rows[1]);
    pdf.text(tableFields.trainingHrs_1_2 || "", table.cols.hrsX, table.rows[1]);
    
    // Shared cost for both semesters
    if (table.cost1Y) {
      pdf.text(tableFields.cost_1 || "", table.cols.costX, table.cost1Y);
    }
  }

  static renderMbaYear2Table(pdf, table, tableFields) {
    // Sem 3 only
    pdf.text(tableFields.studentCount_2_1 || "", table.cols.studentX, table.rows[0]);
    pdf.text(tableFields.trainingHrs_2_1 || "", table.cols.hrsX, table.rows[0]);
    
    // Cost for sem 3
    if (table.cost1Y) {
      pdf.text(tableFields.cost_2 || "", table.cols.costX, table.cost1Y);
    }
  }

  static renderMbaTable(pdf, table, tableFields) {
    // Year 1 Sem 1
    pdf.text(tableFields.studentCount_1_1 || "", table.cols.studentX, table.rows[0]);
    pdf.text(tableFields.trainingHrs_1_1 || "", table.cols.hrsX, table.rows[0]);
    
    // Year 1 Sem 2
    pdf.text(tableFields.studentCount_1_2 || "", table.cols.studentX, table.rows[1]);
    pdf.text(tableFields.trainingHrs_1_2 || "", table.cols.hrsX, table.rows[1]);
    
    // Shared cost for Year 1 (both semesters)
    if (table.cost1Y) {
      pdf.text(tableFields.cost_1 || "", table.cols.costX, table.cost1Y);
    }
    
    // Year 2 Sem 3
    pdf.text(tableFields.studentCount_2_1 || "", table.cols.studentX, table.rows[2]);
    pdf.text(tableFields.trainingHrs_2_1 || "", table.cols.hrsX, table.rows[2]);
    
    // Cost for Year 2
    pdf.text(tableFields.cost_2 || "", table.cols.costX, table.rows[2]);
  }

  static renderEngineeringTable(pdf, table, engFields) {
    table.rows.forEach((y, r) => {
      const suffix = `y${r + 1}`;
      const studentVal = engFields[`studentCount_${suffix}`] ?? engFields[`studentCount_${r + 1}`] ?? "";
      const costVal = engFields[`cost_${suffix}`] ?? engFields[`cost_${r + 1}`] ?? "";
      const hoursVal = engFields[`hours_${suffix}`] ?? engFields[`hours_${r + 1}`] ?? "";

      pdf.text(String(studentVal), table.cols.studentX, y);
      pdf.text(String(costVal), table.cols.costX, y);
      pdf.text(String(hoursVal), table.cols.hoursX, y);
    });
  }

  static renderMbaMcaTable(pdf, table, mbaMcaFields) {
    // CORRECTED: Row 2 (MBA 1-2) and Row 5 (MCA 1-2) should NOT have cost property
    // because they share the cost with the first semester of their respective years
    const rowsData = [
      // Row 1: MBA 1-1 (Has cost - shared for Year 1)
      {
        c: mbaMcaFields.mba_1_1_count,
        h: mbaMcaFields.mba_1_1_hours,
        cost: mbaMcaFields.mba_year1_cost, // Shared cost for MBA Year 1
      },
      // Row 2: MBA 1-2 (NO cost - shares with Row 1)
      {
        c: mbaMcaFields.mba_1_2_count,
        h: mbaMcaFields.mba_1_2_hours,
        // NO cost property - shares with MBA 1-1
      },
      // Row 3: MBA 2-1 (Has its own cost)
      {
        c: mbaMcaFields.mba_2_1_count,
        h: mbaMcaFields.mba_2_1_hours,
        cost: mbaMcaFields.mba_2_1_cost,
      },

      // Row 4: MCA 1-1 (Has cost - shared for Year 1)
      {
        c: mbaMcaFields.mca_1_1_count,
        h: mbaMcaFields.mca_1_1_hours,
        cost: mbaMcaFields.mca_year1_cost, // Shared cost for MCA Year 1
      },
      // Row 5: MCA 1-2 (NO cost - shares with Row 4)
      {
        c: mbaMcaFields.mca_1_2_count,
        h: mbaMcaFields.mca_1_2_hours,
        // NO cost property - shares with MCA 1-1
      },
      // Row 6: MCA 2-1 (Has its own cost)
      {
        c: mbaMcaFields.mca_2_1_count,
        h: mbaMcaFields.mca_2_1_hours,
        cost: mbaMcaFields.mca_2_1_cost,
      },
    ];

    rowsData.forEach((data, idx) => {
      const y = table.rows[idx];
      if (!y) return;

      pdf.text(String(data.c || ""), table.cols.studentX, y);
      pdf.text(String(data.h || ""), table.cols.hrsX, y);
      
      // Only render cost if the property exists
      if ('cost' in data) {
        pdf.text(String(data.cost || ""), table.cols.costX, y);
      }
    });
  }
}