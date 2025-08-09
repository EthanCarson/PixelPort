import { createClient } from '@sanity/client';

export default createClient({
  projectId: '3echqo2e',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use a UTC date in YYYY-MM-DD format
});
