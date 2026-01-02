export const ENGINEERING_BRANCHES = [
  { 
    id: 'elec', 
    label: 'Electrical Engineering',
    syllabusTable: [
      ["Control System", "Circuit Design", "Analogue Designing"],
      ["Wiring Harness", "Transmission & Transformer", "Battery Management System"],
      ["Automation", "Semiconductors", "EV: Matlab, Simulink"]
    ]
  },
  { 
    id: 'comp', 
    label: 'Computer Engineering',
    syllabusTable: [
      ["Java Fundamentals", "Object- Oriented Programming (OOP)", "Full Stack Web Development with Python"],
      ["Full Stack Android", "Java Script", "Java Script Fundamentals"],
      ["Dev-ops", "Data Types & Variables", "Introduction to web development with flask"],
      ["Python", "Advance Python", "Cyber Security"]
    ]
  },
  { id: 'mech', label: 'Mechanical Engineering', syllabusTable: [["Catia V5", "Solidworks", "Core Technical"], ["Cad & CAM", "Auto CAD", "Assembly"], ["Creo", "UG (NX)", "Part Modelling"]] },
  { id: 'civil', label: 'Civil Engineering', syllabusTable: [["Auto Cad", "Estimation & Costing", "Bill of quantity"], ["Stad Pro", "3D designing & Drafting", "Building quantities"], ["Surveying", "Rate analysis", "Types of Estimates"], ["Revit", "BIM", "Max 3D"]] },
  { id: 'entc', label: 'ENTC Engineering', syllabusTable: [["PLC", "SCADA", "Automation"], ["Semiconductors", "Python", "IoT"], ["Chip Programming", "Electronic Packaging", "3D Transistor Process"]] },
  { id: 'aids', label: 'AI & DS', syllabusTable: [["Data Science with Python", "Introduction to Data Science", "Basic Python"], ["Importing Data", "Manipulating Data", "Statistics Basics"], ["Error Metrics", "Machine Learning", "Supervised learning"]] },
  { id: 'auto', label: 'Automation & Robotics', syllabusTable: [["Introduction to Robotics", "Robot Kinematics", "Advanced Robotics"], ["Machine Learning and AI in Robotics", "Types of Automation", "Control Systems in Automation"], ["Integration with Robotics", "Machine Learning and AI in Robotics", "Industrial Automation Technologies"]] },
];