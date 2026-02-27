import { describe, it, expect } from "bun:test";
import { makeSessionService } from "../../auth/session"; // adjust path

// Small helper to freeze time
function fixedNow(iso: string) {
    const d = new Date(iso);
    return ()=> new Date(d);  //return fresh date each call 
}

describe("session service touchSession", () => {
  it("no-rotate: returns refreshed:false when lastSeen is recent", async () => {
    const now = fixedNow("2026-01-01T12:00:00Z");

    const sessionRow = {
      userId: "u1",
      sessionHash: "hash",
      expiresAt: new Date("2026-02-01T00:00:00Z"),
      createdAt: new Date("2026-01-01T10:00:00Z"),
      lastSeenAt: new Date("2026-01-01T11:30:00Z"), // 0.5 hours ago
    };

    let findUniqueCalled = 0;
    let transactionCalled = 0;

    const prismaMock = {
      session: {
        findUnique: async () => {
          findUniqueCalled++;
          return sessionRow;
        },
        create: async () => {
          throw new Error("should not create in no-rotate path");
        },
        delete: async () => {
          throw new Error("should not delete in no-rotate path");
        },
      },
      $transaction: async () => {
        transactionCalled++;
        return [];
      },
      user: {},
    };

    const svc = makeSessionService(prismaMock as any, now);
    const result = await svc.touchSession("token-doesnt-matter");

    expect(findUniqueCalled).toBe(1);
    expect(transactionCalled).toBe(0);
    expect(result).toEqual({
      refreshed: false,
      expiresAt: sessionRow.expiresAt,
    });
  });

  it("expired: returns null when expiresAt is in the past", async () => {
    const now = fixedNow("2026-01-01T12:00:00Z");

    const expiredSession = {
      userId: "u1",
      sessionHash: "hash",
      expiresAt: new Date("2026-01-01T11:59:59Z"),
      createdAt: new Date("2026-01-01T10:00:00Z"),
      lastSeenAt: new Date("2026-01-01T10:00:00Z"),
    };

    let transactionCalled = 0;

    const prismaMock = {
      session: {
        findUnique: async () => expiredSession,
        create: async () => ({}),
        delete: async () => ({}),
      },
      $transaction: async () => {
        transactionCalled++;
        return [];
      },
      user: {},
    };

    const svc = makeSessionService(prismaMock as any, now);
    const result = await svc.touchSession("token");

    expect(result).toBeNull();
    expect(transactionCalled).toBe(0);
  });

  it("rotate: creates a new session row and deletes old row via $transaction", async () => {
    const now = fixedNow("2026-01-02T12:00:00Z");

    const oldSession = {
      userId: "u1",
      sessionHash: "oldhash",
      expiresAt: new Date("2026-02-01T00:00:00Z"),
      createdAt: new Date("2026-01-01T00:00:00Z"),
      lastSeenAt: new Date("2026-01-01T00:00:00Z"), // 36 hours ago -> rotate
    };

    const createdOps: any[] = [];
    const deletedOps: any[] = [];

    let transactionOpsCount = 0;
    let requestedHash = "";

    const prismaMock = {
      session: {
        findUnique: async (args: any) => {
            requestedHash = args.where.sessionHash; //capture what the code computed
            return {
                ...oldSession,
                sessionHash: requestedHash, // keep it consistent
            };
        },

        // In real Prisma, session.create/delete return "PrismaPromise".
        // For our unit test, they can return identifiable objects.
        create: (args: any) => {
          createdOps.push(args);
          return { op: "create", args };
        },

        delete: (args: any) => {
          deletedOps.push(args);
          return { op: "delete", args };
        },
      },

      $transaction: async (ops: any[]) => {
        transactionOpsCount = ops.length;
        return ops;
      },
      user: {},
    };

    const svc = makeSessionService(prismaMock as any, now);
    const result = await svc.touchSession("some-old-token");

    // Should rotate
    expect(result).not.toBeNull();
    expect(result!.refreshed).toBe(true);
    expect((result as any).token).toBeTruthy();
    expect((result as any).expiresAt instanceof Date).toBe(true);

    // Transaction should include exactly 2 ops: create + delete
    expect(transactionOpsCount).toBe(2);

    // Validate it tried to create the new session row
    expect(createdOps.length).toBe(1);
    expect(createdOps[0].data.userId).toBe("u1");
    expect(createdOps[0].data.lastSeenAt instanceof Date).toBe(true);
    expect(createdOps[0].data.expiresAt instanceof Date).toBe(true);
    expect(typeof createdOps[0].data.sessionHash).toBe("string");

    // Validate it tried to delete the old row by sessionHash
    expect(deletedOps.length).toBe(1);
    expect(deletedOps[0]).toEqual({ where: { sessionHash: requestedHash } });
  });
});