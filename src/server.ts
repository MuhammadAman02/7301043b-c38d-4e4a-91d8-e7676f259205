import { createApp } from './app';

const start = async () => {
  try {
    const app = await createApp();

    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server listening at http://localhost:3000");
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
