import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 개발 서버에서 '/api/*' 요청을 백엔드(8080)로 프록시.
// 같은 origin 처럼 보이게 해서 CORS 의존성을 줄이고, 환경변수를 추가하지 않는다.
// 프로덕션에서는 reverse proxy 또는 동일 호스트에서 같은 경로 규약을 그대로 쓴다.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
