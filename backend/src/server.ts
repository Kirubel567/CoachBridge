//db connection and server setup
import "dotenv/config";
import app from "./app";             // import the express app
import { prisma } from "./config/prisma"; // import the prisma client to connect to the databaseS

const PORT = 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();
