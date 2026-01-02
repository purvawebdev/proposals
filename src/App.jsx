import React from "react";
import SimplePdfGenerator from "./components/SimplePdf.jsx";

function App() {
  // 1. Define common pages (1-7) to avoid repeating them 3 times
  const mbaCommonPages = [
    { bg: "/mba/1.jpg", editable: true },
    { bg: "/mba/2.jpg", editable: false },
    { bg: "/mba/3.jpg", editable: false },
    { bg: "/mba/4.jpg", editable: false },
    { bg: "/mba/5.jpg", editable: false },
    { bg: "/mba/6.jpg", editable: false },
    { bg: "/mba/7.jpg", editable: false },
  ];

  const pageSets = {
    // SCENARIO 1: Both Years (Default) -> Ends with 8.jpg
    mba: [...mbaCommonPages, { bg: "/mba/8.jpg", editable: "table" }],

    // SCENARIO 2: 1st Year Only -> Ends with 8_1.jpg
    mba_1: [...mbaCommonPages, { bg: "/mba/8_1.jpg", editable: "table" }],

    // SCENARIO 3: 2nd Year Only -> Ends with 8_2.jpg
    mba_2: [...mbaCommonPages, { bg: "/mba/8_2.jpg", editable: "table" }],

    // Engineering remains the same
    engineering: [
      { bg: "/eng/1.jpg", editable: true },
      { bg: "/eng/2.jpg", editable: false },
      { bg: "/eng/3.jpg", editable: false },
      { bg: "/eng/4.jpg", editable: false },
      { bg: "/eng/5.jpg", editable: false },
      { bg: "/eng/6.jpg", editable: "table" },
    ],

    //MBA + MCA Combined
    mba_mca: [
      { bg: "/mca/1.jpg", editable: true },
      { bg: "/mca/2.jpg", editable: false },
      { bg: "/mca/3.jpg", editable: false },
      { bg: "/mca/4.jpg", editable: false },
      { bg: "/mca/5.jpg", editable: false },
      { bg: "/mca/6.jpg", editable: false },
      { bg: "/mca/7.jpg", editable: "table" },
    ],
  };

  return (
    <main className="min-h-screen bg-[#d0d6dc] p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-0 overflow-hidden">
        {/* Removed padding p-8 from here because SimplePdfGenerator has its own layout/padding now */}
        <SimplePdfGenerator pageSets={pageSets} />
      </div>
    </main>
  );
}

export default App;