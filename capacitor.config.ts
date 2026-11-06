import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amarnaath.mergemess',
  appName: 'Merge Mess',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

