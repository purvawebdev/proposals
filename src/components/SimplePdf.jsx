// components/SimplePdfGenerator.jsx
import React from "react";
import jsPDF from "jspdf";
import { usePdfFormState } from "../hooks/usePdfFormState";
import { PdfGenerationService } from "../services/pdfGeneration";
import { DomainSelector } from "./DomainSelector";
import { GenerateButton } from "./GenerateButton";
import { PAGE_DIMENSIONS, DOMAINS } from "../constants/pdfConstants";

import MBAForm from "../forms/MBAForm";
import EngineeringForm from "../forms/EngineeringForm";
import MbaMcaForm from "../forms/MbaMcaForm";
import CommonFields from "../fields/CommonFields";

export default function SimplePdfGenerator({ pageSets }) {
  const {
    domain,
    setDomain,
    collegeName,
    setCollegeName,
    logo,
    loading,
    setLoading,
    tableFields,
    setTableFields,
    engFields,
    setEngFields,
    mbaMcaFields,
    setMbaMcaFields,
    handleLogoUpload
  } = usePdfFormState();

 const generate = async () => {
    try {
      setLoading(true);

      // 1. Determine the active domain (handles mba, mba_1, mba_2)
      const activeDomain = PdfGenerationService.determineActiveDomain(domain, tableFields);
      
      // 2. CONSTRUCT THE PAGE LIST
      let pagesToPrint = [];

      // --- ENGINEERING LOGIC (Dynamic Pages) ---
      if (domain === DOMAINS.ENGINEERING) {
        const selectedBranches = engFields.selectedBranches || [];
        
        if (selectedBranches.length === 0) {
          alert("Please select at least one branch.");
          setLoading(false);
          return;
        }

        const engRawPages = pageSets[DOMAINS.ENGINEERING]; 
        // Assumes structure: [P1, P2, P3(Aptitude), P_Last(Table)]

        // A. Add Intro Pages (Page 1 & 2)
        pagesToPrint.push(engRawPages[0]);
        pagesToPrint.push(engRawPages[1]);

        // B. Add Branch Pages
        // Page 3 (Aptitude) used for the FIRST branch
        const aptitudeBg = engRawPages[2].bg; 
        // Generic Background for SUBSEQUENT branches
        const genericBg = "/eng/generic.jpg"; 

        // --- 1. FIRST BRANCH (Aptitude Page) ---
        if (selectedBranches.length > 0) {
          pagesToPrint.push({ 
            bg: aptitudeBg, 
            editable: "eng_branch_first", 
            branchId: selectedBranches[0] // First branch only
          });
        }

        // --- 2. REMAINING BRANCHES (Group 2 per Generic Page) ---
        const remaining = selectedBranches.slice(1);
        const BRANCHES_PER_PAGE = 2;

        for (let i = 0; i < remaining.length; i += BRANCHES_PER_PAGE) {
            const batch = remaining.slice(i, i + BRANCHES_PER_PAGE);
            
            // Calculate Y positions: Top (50) and Bottom (400)
            const branchConfigs = batch.map((branchId, index) => ({
                id: branchId,
                y: 100 + (index * 350) // 350px gap between branches
            }));

            pagesToPrint.push({
                bg: genericBg,
                editable: "eng_branch_multi", // New flag
                branchesToRender: branchConfigs
            });
        }

        // C. Add Table Page (Last one)
        pagesToPrint.push(engRawPages[engRawPages.length - 1]);

      } else {
        // --- STANDARD LOGIC (MBA / MBA_MCA) ---
        // Just use the static list defined in App.js
        pagesToPrint = pageSets[activeDomain] || [];
      }

      if (pagesToPrint.length === 0) {
        alert(`No pages found for ${activeDomain}. Check your pageSets data.`);
        setLoading(false);
        return;
      }

      // 3. RENDER LOOP
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_DIMENSIONS.WIDTH, PAGE_DIMENSIONS.HEIGHT],
      });

      for (let i = 0; i < pagesToPrint.length; i++) {
        const pageData = pagesToPrint[i];
        const { bg, editable } = pageData;

        const bgImg = await PdfGenerationService.loadImage(bg);
        if (i > 0) pdf.addPage([PAGE_DIMENSIONS.WIDTH, PAGE_DIMENSIONS.HEIGHT]);
        pdf.addImage(bgImg, "PNG", 0, 0, PAGE_DIMENSIONS.WIDTH, PAGE_DIMENSIONS.HEIGHT);

        const coordinates = PdfGenerationService.getCoordinatesForDomain(activeDomain);

        if (editable === true) {
          await PdfGenerationService.renderCollegeAndLogo(
            pdf,
            collegeName,
            logo,
            coordinates,
            domain
          );
        }

        // --- NEW: Render Engineering Branch Info ---
        if (editable === "eng_branch_first") {
           // 500 is the Y position for the bottom of the Aptitude page
           await PdfGenerationService.renderBranchInfo(pdf, pageData.branchId, 450);
        }

        // --- RENDER MULTIPLE BRANCHES (Generic Pages) ---
        if (editable === "eng_branch_multi" && pageData.branchesToRender) {
           for (const bConfig of pageData.branchesToRender) {
              // bConfig contains { id: 'mech', y: 50 }
              await PdfGenerationService.renderBranchInfo(pdf, bConfig.id, bConfig.y);
           }
        }

        if (editable === "table") {
          PdfGenerationService.renderTableData(pdf, coordinates, activeDomain, {
            tableFields,
            engFields,
            mbaMcaFields,
          });
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

      <DomainSelector domain={domain} setDomain={setDomain} />

      <CommonFields
        collegeName={collegeName}
        setCollegeName={setCollegeName}
        logo={logo}
        handleLogoUpload={handleLogoUpload}
      />

      {domain === DOMAINS.MBA && (
        <MBAForm tableFields={tableFields} setTableFields={setTableFields} />
      )}

      {domain === DOMAINS.ENGINEERING && (
        <EngineeringForm engFields={engFields} setEngFields={setEngFields} />
      )}

      {domain === DOMAINS.MBA_MCA && (
        <MbaMcaForm
          mbaMcaFields={mbaMcaFields}
          setMbaMcaFields={setMbaMcaFields}
        />
      )}

      <GenerateButton loading={loading} onClick={generate} />
    </div>
  );
}