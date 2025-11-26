import React from "react";
import SimplePdfGenerator from "./components/SimplePdf.jsx";

function App() {
  const pageSets = {
    mba: [
    { bg: "/mba/1.jpg", editable: true },
    { bg: "/mba/2.jpg", editable: false },
    { bg: "/mba/3.jpg", editable: false },
    { bg: "/mba/4.jpg", editable: false },
    { bg: "/mba/5.jpg", editable: false },
    { bg: "/mba/6.jpg", editable: "table" },
  ],

  engineering: [
    { bg: "/eng/1.jpg", editable: true },
    { bg: "/eng/2.jpg", editable: false },
    { bg: "/eng/3.jpg", editable: false },
    { bg: "/eng/4.jpg", editable: false },
    { bg: "/eng/5.jpg", editable: false },
    { bg: "/eng/6.jpg", editable: "table" },
  ],
  }
  return (
    <main className="min-h-screen bg-[#d0d6dc] p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <SimplePdfGenerator pageSets={pageSets} />
      </div>
    </main>
  );
}

export default App;
