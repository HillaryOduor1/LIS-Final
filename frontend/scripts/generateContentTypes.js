/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME || 'landscapes_integrity_solutions';

// Use VITE_API_URL from env, fallback to localhost
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    
    if (!content) throw new Error('No content received from API');

    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // Generate TypeScript interfaces (simple inference)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { 
            type: value === null ? 'null' :
                   typeof value === 'object' && !Array.isArray(value) ? 'object' : 
                   Array.isArray(value) ? 'array' : typeof value
          }
        ])
      ),
      additionalProperties: true
    };
   
    const types = await compile(schema,'SiteContent',{
      bannerComment:`/*Auto generated for tenant:${TENANT_NAME}-DO NOT EDIT MANUALLY */\n`,
      style:{singleQuote:true}
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

generate();
/*
/* eslint-disable no-undef /
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME || 'landscapes_integrity_solutions';
const API_URL = `http://localhost:5000/api/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    
    if (!content) throw new Error('No content received from API');

    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // Generate TypeScript interfaces (simple inference)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { 
            type: value === null ? 'null' :
                   typeof value === 'object' && !Array.isArray(value) ? 'object' : 
                   Array.isArray(value) ? 'array' : typeof value
          }
        ])
      ),
      additionalProperties: true
    };
   
    const types = await compile(schema,'SiteContent',{
      bannerComment:`/*Auto generated for tenant:${TENANT_NAME}-DO NOT EDIT MANUALLY /\n`,
      style:{singleQuote:true}
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

generate();
*/

/*import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5000/api/content?tenant=landscapes_integrity_solutions';
const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log('📡 Fetching content from', API_URL);
    const response = await axios.get(API_URL);
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    if (!content) throw new Error('No content received');

    // defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API - DO NOT EDIT MANUALLY
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // TypeScript interfaces (simplified schema)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { type: typeof value === 'object' && !Array.isArray(value) ? 'object' : Array.isArray(value) ? 'array' : typeof value }
        ])
      ),
      additionalProperties: true
    };
    const types = await compile(schema, 'SiteContent', {
      bannerComment: '/* Auto-generated from backend API - DO NOT EDIT MANUALLY /\n',
      style: { singleQuote: true }
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

generate();*/