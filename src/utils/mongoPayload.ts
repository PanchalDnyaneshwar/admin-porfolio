type MongoPrimitive = string | number | boolean | null | undefined;
type MongoRecord = Record<string, unknown>;

const FORBIDDEN_KEYS = new Set(['_id', '__v', 'createdAt', 'updatedAt', 'id']);

/**
 * Admin forms often reset with raw MongoDB documents.
 * Since the backend uses `forbidNonWhitelisted`, we must remove Mongo metadata
 * before sending request bodies.
 */
export function stripMongoDocumentFields<T extends MongoRecord>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const copy: MongoRecord = { ...obj };
  for (const key of FORBIDDEN_KEYS) {
    if (key in copy) delete copy[key];
  }

  return copy as T;
}

export function stripMongoDocumentFieldsDeep<T extends MongoRecord>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const visit = (value: unknown): unknown => {
    if (!value || typeof value !== 'object') return value;

    if (Array.isArray(value)) {
      return value.map(visit);
    }

    const record = value as MongoRecord;
    const next: MongoRecord = {};
    for (const [k, v] of Object.entries(record)) {
      if (FORBIDDEN_KEYS.has(k)) continue;
      next[k] = visit(v);
    }
    return next;
  };

  return visit(obj) as T;
}

