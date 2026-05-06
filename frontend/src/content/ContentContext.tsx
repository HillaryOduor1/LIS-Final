// frontend/src/content/ContentContext.tsx
import * as React from "react";
import { defaultContent } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

interface ContentContextType {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetContent: () => void;
  updateContent: (updates: Partial<SiteContent>) => Promise<boolean>;
  isSaving: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const ContentContext = React.createContext<ContentContextType>({
  content: defaultContent as SiteContent,
  setContent: () => {},
  resetContent: () => {},
  updateContent: async () => false,
  isSaving: false,
  isLoading: false,
  refresh: async () => {},
});
/*import * as React from "react";
//import { defaultContent, SiteContent } from "./defaultContent";
import { defaultContent } from "./defaultContent";
import type { SiteContent } from "./defaultContent";

interface ContentContextType {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetContent: () => void;
  updateContent: (updates: Partial<SiteContent>) => Promise<boolean>;
  isSaving: boolean;
}

export const ContentContext = React.createContext<ContentContextType>({
  content: defaultContent,
  setContent: () => { },
  resetContent: () => { },
  updateContent: async () => false,
  isSaving: false,
});
*/
