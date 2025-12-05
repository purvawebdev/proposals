import React from "react";
import { Upload, Image as ImageIcon, Type } from "lucide-react";

export default function CommonFields({
  collegeName,
  setCollegeName,
  logo,
  handleLogoUpload,
}) {
  return (
    <div className="space-y-6">
      {/* College Name Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Type size={16} className="text-indigo-500" />
          Client Name
        </label>
        <input
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="e.g. Pune Institute of Technology"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
        />
      </div>

      {/* Logo Upload Area */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <ImageIcon size={16} className="text-indigo-500" />
          College Logo
        </label>
        
        <div className="relative group">
          {/* Hidden Real Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {/* Custom Visual Interface */}
          <div className={`
            border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
            ${logo 
              ? "border-indigo-200 bg-indigo-50/30" 
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            }
          `}>
            {logo ? (
              <div className="flex flex-col items-center">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 mb-3">
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="h-16 object-contain max-w-[120px]"
                  />
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  Click to replace
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center py-2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-indigo-50 transition-colors">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Click to upload logo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG or JPG (Max 2MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}