import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionic.todo',
  appName: 'TodoApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
