// sections/ResearchFilters.tsx

import { useState } from "react";
import { trackEvent } from '../analytics';

const ResearchFilters = () => {
  const [activeFilter, setActiveFilter] = useState("All Areas");
  
  const filters = [
    "All Areas",
    "Environment",
    "Natural Resources",
    "Land Governance",
    "Climate Policy"
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    trackEvent('research_filter_click', { filter });
  };

  return (
    <section className="py-8 bg-white dark:bg-background-dark/50 border-b border-[#e7f3ed] dark:border-white/5 sticky top-16 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-bold whitespace-nowrap mr-2">Filter by Topic:</span>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-background-dark font-bold"
                  : "bg-primary/10 hover:bg-primary/20 text-[#0d1b14] dark:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchFilters;
/*import * as React from 'react';
import { useState } from "react";

const ResearchFilters = () => {
  const [activeFilter, setActiveFilter] = useState("All Areas");
  
  const filters = [
    "All Areas",
    "Environment",
    "Natural Resources",
    "Land Governance",
    "Climate Policy"
  ];

  return (
    <section className="py-8 bg-white dark:bg-background-dark/50 border-b border-[#e7f3ed] dark:border-white/5 sticky top-16 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-bold whitespace-nowrap mr-2">Filter by Topic:</span>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-background-dark font-bold"
                  : "bg-primary/10 hover:bg-primary/20 text-[#0d1b14] dark:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchFilters;*/