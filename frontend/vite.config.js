import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const server_url = JSON.stringify(env.VITE_SERVER_URL);

  return {
    server: {
      proxy: {
        "/api": server_url,
      },
    },
    plugins: [react()],
  }

});