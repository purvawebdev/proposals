import React from "react";
import { Bell, Search, Menu, User } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        {/* Search Bar (Visual only) */}
        <div className="hidden md:flex items-center relative">
          <Search size={16} className="absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search proposals..." 
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
          <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-700">Admin User</p>
            <p className="text-[10px] text-gray-500">Proposal Manager</p>
          </div>
        </button>
      </div>
    </header>
  );
}