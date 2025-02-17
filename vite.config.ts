import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDirectory = path.join(__dirname, "src/frontend");
const isDevelopment = process.env.DFX_NETWORK !== "ic";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/frontend/src"),
    },
  },
  root: frontendDirectory,
  define: {
    global: 'globalThis',
    'process.env.DFX_NETWORK': JSON.stringify(isDevelopment ? "local" : "ic"),
    // Use the actual canister IDs from dfx deploy output
    'process.env.INTERNET_IDENTITY_CANISTER_ID': JSON.stringify("br5f7-7uaaa-aaaaa-qaaca-cai"),
    'process.env.CHAINCYCLE_BACKEND_CANISTER_ID': JSON.stringify("bkyz2-fmaaa-aaaaa-qaaaq-cai"),
    'process.env.CHAINCYCLE_FRONTEND_CANISTER_ID': JSON.stringify("bd3sg-teaaa-aaaaa-qaaba-cai"),
    'process.env.GTK_TOKEN_CANISTER_ID': JSON.stringify("be2us-64aaa-aaaaa-qaabq-cai"),
    'process.env.MARKETPLACE_CANISTER_ID': JSON.stringify("bw4dl-smaaa-aaaaa-qaacq-cai"),
    'process.env.USER_PROFILE_CANISTER_ID': JSON.stringify("b77ix-eeaaa-aaaaa-qaada-cai"),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: isDevelopment
      ? {
          "/api": {
            target: "http://127.0.0.1:4943",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
          "/.well-known/ii-alternative-origins": {
            target: "http://127.0.0.1:4943",
            changeOrigin: true,
          }
        }
      : undefined,
    strictPort: true,
    hmr: {
      clientPort: 5173
    }
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'auth': ['@dfinity/auth-client', '@dfinity/agent', '@dfinity/principal'],
          'react': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
