import { PrismaClient } from "@prisma/client";

function getSanitizedDatabaseUrl(): string | undefined {
  let raw = process.env.DATABASE_URL;
  if (!raw) return undefined;

  try {
    // If the database URL contains an unescaped '#' or '!' in the password
    // Format: mysql://user:password@host:port/dbname
    const match = raw.match(/^(mysql:\/\/[^:]+:)(.*)(@[^@]+)$/);
    if (match) {
      const prefix = match[1];
      const rawPassword = match[2];
      const suffix = match[3];
      // URL-encode password characters, preserving already-encoded sequences
      const cleanPassword = encodeURIComponent(decodeURIComponent(rawPassword));
      raw = `${prefix}${cleanPassword}${suffix}`;
    }
  } catch {
    // fallback to raw if regex fails
  }

  return raw;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = getSanitizedDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        }
      : undefined
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
