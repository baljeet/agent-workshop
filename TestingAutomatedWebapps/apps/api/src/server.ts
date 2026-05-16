import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? "4200");
const host = process.env.HOST ?? "0.0.0.0";

const start = async (): Promise<void> => {
  const app = await createApp({ dataDir: process.env.DATA_DIR });

  try {
    await app.listen({ port, host });
    app.log.info(`API listening on http://${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
