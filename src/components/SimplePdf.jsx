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

      const activeDomain = PdfGenerationService.determineActiveDomain(domain, tableFields);
      const pagesToPrint = pageSets[activeDomain] || [];
      
      if (pagesToPrint.length === 0) {
        alert(`No pages found for ${activeDomain}. Check your pageSets data.`);
        setLoading(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_DIMENSIONS.WIDTH, PAGE_DIMENSIONS.HEIGHT],
      });

      for (let i = 0; i < pagesToPrint.length; i++) {
        const { bg, editable } = pagesToPrint[i];
        
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

        if (editable === "table") {
          PdfGenerationService.renderTableData(pdf, coordinates, activeDomain, {
            tableFields,
            engFields,
            mbaMcaFields
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