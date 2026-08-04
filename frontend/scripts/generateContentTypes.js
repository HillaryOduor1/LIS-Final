/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME || 'landscapes_integrity_solutions';

// Use VITE_API_URL from env, fallback to localhost
// Add /v1/ to the API path
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_URL = `${API_BASE}/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

// Define the theme type structure that should always be included
const THEME_TYPE = `
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };`;

// Helper to extract content from API response
function extractContentFromResponse(responseData) {
  console.log('Response data structure:', Object.keys(responseData));
  
  // Case 1: Our backend success response format: { success: true, message: "...", data: {...} }
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    // If data is an array, find home page or take first item
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        throw new Error('Empty data array received');
      }
      const homeContent = dataContent.find(item => item.page === 'home') || dataContent[0];
      // Check if the content has a nested data property (from transformer)
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        return homeContent.data;
      }
      return homeContent;
    }
    
    // If data is an object (single content)
    if (typeof dataContent === 'object') {
      // Check if it has a nested data property (from transformer)
      if (dataContent.data && typeof dataContent.data === 'object') {
        return dataContent.data;
      }
      return dataContent;
    }
  }
  
  // Case 2: Direct content object
  if (responseData && responseData.page === 'home') {
    return responseData;
  }
  
  // Case 3: Array of content items
  if (Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find(item => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      return homeContent.data;
    }
    return homeContent;
  }
  
  throw new Error('Unable to extract content from response');
}

async function generate() {
  try {
    console.log(`Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers['content-type']);
    
    // Extract the actual content from the response
    const content = extractContentFromResponse(response.data);
    
    if (!content) {
      throw new Error('No content extracted from API response');
    }
    
    console.log(`Content extracted successfully`);
    console.log(`Content keys: ${Object.keys(content).join(', ')}`);
    
    // Remove any internal fields that shouldn't be in default content
    const cleanContent = { ...content };
    delete cleanContent._id;
    delete cleanContent.__v;
    delete cleanContent.createdAt;
    delete cleanContent.updatedAt;
    delete cleanContent.tenantId;
    
    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export const defaultContent = ${JSON.stringify(cleanContent, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('Generated', DEFAULT_CONTENT_FILE);
    console.log(`File size: ${(fs.statSync(DEFAULT_CONTENT_FILE).size / 1024).toFixed(2)} KB`);

    // Generate a more accurate TypeScript interface with theme support
    const generateTypesFromObject = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent);
      if (Array.isArray(obj)) {
        if (obj.length === 0) return 'any[]';
        return `Array<${generateTypesFromObject(obj[0], indent)}>`;
      }
      if (obj && typeof obj === 'object') {
        const properties = Object.entries(obj)
          .filter(([key]) => !key.startsWith('_')) // Skip internal fields
          .map(([key, value]) => {
            const type = generateTypesFromObject(value, indent + 1);
            return `${spaces}  ${key}: ${type};`;
          });
        
        // Add theme property if it doesn't exist
        const hasTheme = Object.keys(obj).some(key => key === 'theme');
        let themeProperty = '';
        if (!hasTheme) {
          themeProperty = `\n${spaces}  ${THEME_TYPE.trim()}`;
        }
        
        return `{\n${properties.join('\n')}${themeProperty}\n${spaces}}`;
      }
      if (typeof obj === 'string') return 'string';
      if (typeof obj === 'number') return 'number';
      if (typeof obj === 'boolean') return 'boolean';
      return 'any';
    };
    
    const typeDefinitions = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export interface SiteContent ${generateTypesFromObject(cleanContent, 0)}
`;
    
    fs.writeFileSync(TYPES_FILE, typeDefinitions);
    console.log('Generated', TYPES_FILE);
    
    console.log('\n Content generation completed successfully!');
    console.log(`Files updated in: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.request) {
      console.error('No response received from server');
    }
    process.exit(1);
  }
}

generate();
