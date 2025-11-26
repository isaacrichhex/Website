// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // For a project site hosted at https://<username>.github.io/Website/
  // base must match the repository name exactly (case-sensitive).
  base: '/Website/',
  // If you later move to a user site (https://<username>.github.io) or a custom domain,
  // change this to: base: '/'
});
