import { createApp } from './app';
import { env } from './config/env';

async function main() {
  const app = await createApp();

  app.listen(env.PORT, env.HOST, () => {
    console.log(`\n🚀 Server running at http://${env.HOST}:${env.PORT}`);
    console.log(`📡 API:     http://localhost:${env.PORT}/api`);
    console.log(`🔧 Admin:   http://localhost:${env.PORT}/admin`);
    console.log(`🏥 Health:  http://localhost:${env.PORT}/health`);
    console.log(`📂 Uploads: http://localhost:${env.PORT}/uploads`);
    console.log(`\n🌍 Environment: ${env.NODE_ENV}\n`);
  });
}

main().catch((err) => {
  console.error('💥 Failed to start server:', err);
  process.exit(1);
});
