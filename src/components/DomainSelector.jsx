// components/DomainSelector.jsx
import React from 'react';

export const DomainSelector = ({ domain, setDomain }) => (
  <div className="mb-6">
    <label className="block font-semibold mb-2">Select Domain</label>
    <select
      value={domain}
      onChange={(e) => setDomain(e.target.value)}
      className="w-full p-3 border rounded-lg"
    >
      <option value="mba">MBA</option>
      <option value="engineering">Engineering</option>
      <option value="mba_mca">MBA + MCA</option>
    </select>
  </div>
);