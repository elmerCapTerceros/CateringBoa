import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bo.boa.catering',
  appName: 'BOA Catering',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos'],
    },
  },
};

export default config;
