// hooks/usePdfFormState.js
import { useState } from 'react';

export const usePdfFormState = () => {
  const [domain, setDomain] = useState('mba');
  const [collegeName, setCollegeName] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  // MBA Fields
  const [tableFields, setTableFields] = useState({
    studentCount_1_1: '',
    trainingHrs_1_1: '',
    studentCount_1_2: '',
    trainingHrs_1_2: '',
    cost_1: '',
    studentCount_2_1: '',
    trainingHrs_2_1: '',
    cost_2: '',
  });

  // Engineering Fields
  const [engFields, setEngFields] = useState({
    cse_students: '',
    cse_hours: '',
    cse_cost: '',
  });

  const [mbaMcaFields, setMbaMcaFields] = useState({
    mba_1_1_count: '',
    mba_1_1_hours: '',
    mba_1_2_count: '',
    mba_1_2_hours: '',
    mba_year1_cost: '',
    
    mba_2_1_count: '',
    mba_2_1_hours: '',
    mba_2_1_cost: '',
    
    mca_1_1_count: '',
    mca_1_1_hours: '',
    mca_1_2_count: '',
    mca_1_2_hours: '',
    mca_year1_cost: '',
    
    mca_2_1_count: '',
    mca_2_1_hours: '',
    mca_2_1_cost: '',
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  return {
    domain,
    setDomain,
    collegeName,
    setCollegeName,
    logo,
    setLogo,
    loading,
    setLoading,
    tableFields,
    setTableFields,
    engFields,
    setEngFields,
    mbaMcaFields,
    setMbaMcaFields,
    handleLogoUpload
  };
};