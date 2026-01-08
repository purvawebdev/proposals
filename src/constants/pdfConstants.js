// constants/pdfConstants.js

export const PAGE_DIMENSIONS = {
  WIDTH: 595,
  HEIGHT: 842
};

export const DOMAINS = {
  MBA: 'mba',
  ENGINEERING: 'engineering',
  MBA_MCA: 'mba_mca',
  MBA_1: 'mba_1',
  MBA_2: 'mba_2'
};

export const COORDINATES = {
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
      rows: [565, 605, 640],
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
      rows: [410, 450],
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
      rows: [200],
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
      fontSize: 14,
      cols: { studentX: 120, costX: 210, hoursX: 515 },
      rows: [218, 235, 255, 276],
    },
  },

  // MBA+MCA (Updated coordinates)
  mba_mca: {
    college: {
      x: 48,  // Changed from 56 to 48
      y: 380, // Changed from 320 to 380
      fontSize: 20,
      fontName: "helvetica",
      fontStyle: "bold",
    },
    logo: {
      x: 595 - 220 - 30,
      y: 842 - 130 - 40,
      maxWidth: 220,
      maxHeight: 130,
    },
    table: {
      fontName: "times",
      fontStyle: "normal",
      fontSize: 15,
      cols: { studentX: 255, hrsX: 355, costX: 470 }, // Updated X values
      rows: [110, 150, 180, 300, 340, 380], // Updated Y values
    },
  },
};