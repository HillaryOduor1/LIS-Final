import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

interface ResearchItem {
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  link: string;
}

const ResearchDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const researchItems = (content && content.research) ? (content.research as ResearchItem[]) : [];
  const item = researchItems.find((r) => r.link === `/research/${slug}`);

  React.useEffect(() => {
    if (item) document.title = `${item.title} | LIS Research`;
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Research not found</h1>
        <Link to="/research" className="text-primary hover:underline">← Back to Research</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Link to="/research" className="text-primary hover:underline mb-6 inline-block">← Back to Research</Link>
      <h1 className="text-4xl md:text-5xl font-black mb-4">{item.title}</h1>
      <div className="flex gap-3 text-sm text-gray-500 mb-6">
        <span>{item.category}</span>
        <span>•</span>
        <span>{item.date}</span>
      </div>
      <img src={item.image} alt={item.title} className="w-full h-96 object-cover rounded-xl mb-8" />
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>{item.description}</p>
      </div>
    </div>
  );
};

export default ResearchDetail;