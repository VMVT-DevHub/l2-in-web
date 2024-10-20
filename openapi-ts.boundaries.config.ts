import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: 'legacy/fetch',
  input: 'https://sertifikatai.vmvt.lt/api/boundaries/openapi.json',
  output: 'src/utils/boundaries',
  base: '/api/boundaries',
});