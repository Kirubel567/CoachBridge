// Prisma client setup for database connection
// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();

// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// });

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
