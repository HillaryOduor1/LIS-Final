import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

interface AreaItem {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const AreaDetail = () => {
  const { slug } = useParams();
  const { content } = useContent();
  const areas = (content && content.areas) as AreaItem[] || [];
  const area = areas.find(a => a.title.toLowerCase().replace(/\s+/g, '-') === slug);

  React.useEffect(() => {
    if (area) document.title = `${area.title} | LIS Expertise`;
  }, [area]);

  if (!area) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Area not found</h1>
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Link to="/#areas" className="text-primary hover:underline mb-6 inline-block">← Back to Expertise</Link>
      <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-primary text-5xl">{area.icon === 'carbon' ? 'forest' : area.icon}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-6">{area.title}</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>{area.description}</p>
        <p>Learn more about our work in {area.title} – we provide strategic advisory, research, and implementation support.</p>
      </div>
    </div>
  );
};

export default AreaDetail;