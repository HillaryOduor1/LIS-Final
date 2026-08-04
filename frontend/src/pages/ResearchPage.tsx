import { useEffect, useState } from 'react';
import ResearchHero from '../sections/ResearchSection';
import ResearchFilters from '../sections/ResearchFilters';
import FeaturedResearch from '../sections/FeaturedResearch';
import AdvisoryServices from '../sections/AdvisorySection';
import ResearchCTA from '../sections/ResearchCTA';

const ResearchPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Areas");

  useEffect(() => {
    document.title = 'Research & Advisories | Landscapes Integrity Solutions';
  }, []);

  return (
    <main id="main-content" aria-label="Research and Advisories page">
      <ResearchHero />
      <ResearchFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <FeaturedResearch activeFilter={activeFilter} />
      <AdvisoryServices />
      <ResearchCTA />
    </main>
  );
};

export default ResearchPage;
