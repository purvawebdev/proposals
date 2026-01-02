// services/pdfGenerationService.js
import { DOMAINS, COORDINATES, PAGE_DIMENSIONS } from '../constants/pdfConstants';
import { ENGINEERING_BRANCHES } from '../constants/engineeringData';

export class PdfGenerationService {
  static loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Important for some environments
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

  static async renderBranchInfo(pdf, branchId, startY) {
    // 1. Get Data
    const branchInfo = ENGINEERING_BRANCHES.find(b => b.id === branchId);
    if (!branchInfo) return;

    // 2. Set Start Position
    // If it's the Aptitude page (first branch), start lower (500).
    // If it's a Generic page (extra branches), start at the top (100).
   

    // --- CONFIGURATION ---
    const logoSize = 60;
    const boxHeight = 40;
    const fontSize = 22;
    
    // 1. Vertical Alignment Math
    // We want the box to be vertically centered relative to the logo.
    // Offset = (Difference in height) / 2  -> (60 - 40) / 2 = 10px down.
    const centerOffset = (logoSize - boxHeight) / 2; 

    const logoY = startY;                // Logo starts at the anchor point
    const boxY = startY + centerOffset;  // Box is pushed down to center it
    // Text Y is approx: BoxY + HalfBox + HalfFontCapHeight. 28 is a safe "visual center" for size 22 font.
    const textY = boxY + 28;             

    // 2. Horizontal Alignment (Left to Right)
    const logoX = 50;
    const titleX = 110; // Text starts just after where the logo ends (50 + 60 = 110)
    const boxPadding = 10;


    // --- DRAWING ---

    // 3. Draw Title (Branch Name)
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", "bold");
    
    const titleText = branchInfo.label.toUpperCase();
    const textWidth = pdf.getTextWidth(titleText);
    
    // Draw Blue Rounded Box 
    // The box X starts at (titleX - padding), creating that nice overlap with the logo
    pdf.setFillColor(0, 31, 95); 
    pdf.roundedRect(titleX - boxPadding, boxY, textWidth + (boxPadding * 2), boxHeight, 5, 5, "F");

    // Draw Text
    pdf.setTextColor(255, 255, 255); 
    pdf.text(titleText, titleX, textY);

    // 4. Draw Logo (Last, so it sits ON TOP of the blue box edge)
    try {
      const logoPath = `/logos/${branchId}.png`; 
      const bLogo = await PdfGenerationService.loadImage(logoPath);
      
      // Use the variables we defined
      pdf.addImage(bLogo, "PNG", logoX, logoY, logoSize, logoSize); 
    } catch (e) {
      // console.warn(`Logo not found for ${branchId}`);
    }

    // 5. Draw Syllabus Table (The 3x3 Grid) - Black Text, Black Borders
    if (branchInfo.syllabusTable) {
      const tableStartY = startY + 80; // Start 80px below the header
      
      // Table Formatting
      const colWidth = 150; 
      const rowHeight = 45; 
      // Removed 'gap' to make it a proper connected table
      
      // Center the table
      const totalTableWidth = (colWidth * 3);
      const startX = (PAGE_DIMENSIONS.WIDTH - totalTableWidth) / 2; 

      pdf.setFontSize(15);
      pdf.setLineWidth(1.0); // Standard border
      pdf.setDrawColor(0, 0, 0); // Black Border

      // Loop Rows
      branchInfo.syllabusTable.forEach((row, rowIndex) => {
        const y = tableStartY + (rowIndex * rowHeight);
        
        // Loop Columns
        row.forEach((cellText, colIndex) => {
          const x = startX + (colIndex * colWidth);
          
          // A. Draw Cell Box (White Fill, Black Border)
          pdf.setFillColor(255, 255, 255); 
          pdf.rect(x, y, colWidth, rowHeight, "FD"); 
          
          // B. Draw Text (Centered, Black, Bold)
          pdf.setTextColor(0, 0, 0); // Black Text
          pdf.setFont("helvetica", "bold");
          
          // Handle text wrapping
          const splitText = pdf.splitTextToSize(cellText, colWidth - 20);
          
          // Calculate vertical center
          const textY = y + (rowHeight / 2) + 4; 
          const yOffset = (splitText.length - 1) * 5; 

          pdf.text(splitText, x + (colWidth / 2), textY - yOffset, { align: "center" });
        });
      });
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