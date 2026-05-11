// pages/ResearchPage.tsx
import * as React from 'react';
import { useEffect } from 'react';
import ResearchHero from '../sections/ResearchSection';
import ResearchFilters from '../sections/ResearchFilters';
import FeaturedResearch from '../sections/FeaturedResearch';
import AdvisoryServices from '../sections/AdvisorySection';
import ResearchCTA from '../sections/ResearchCTA';

const ResearchPage = () => {
  useEffect(() => {
    document.title = 'Research & Advisories | Landscapes Integrity Solutions';
  }, []);

  return (
    <main id="main-content" aria-label="Research and Advisories page">
      <ResearchHero />
      <ResearchFilters />
      <FeaturedResearch />
      <AdvisoryServices />
      <ResearchCTA />
    </main>
  );
};

export default ResearchPage;
/*
// pages/ResearchPage.tsx
import * as React from 'react';
import { useEffect } from 'react';
import ResearchHero from '../sections/ResearchSection';
import ResearchFilters from '../sections/ResearchFilters';
import FeaturedResearch from '../sections/FeaturedResearch';
import AdvisoryServices from '../sections/AdvisorySection';
import ResearchCTA from '../sections/ResearchCTA';

const ResearchPage = () => {
  useEffect(() => {
    // Update document title
    document.title = 'Research & Advisories | Landscapes Integrity Solutions';
  }, []);

  return (
    <>
      <ResearchHero />
      <ResearchFilters />
      <FeaturedResearch />
      <AdvisoryServices />
      <ResearchCTA />
    </>
  );
};

export default ResearchPage;*/