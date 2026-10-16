export function throwIfSupabaseError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export function asRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}

export function asRow<T>(data: unknown, label = 'Record'): T {
  if (data == null) throw new Error(label + ' was not returned by the database.');
  return data as T;
}

export function stripSystemFields<T extends { id?: unknown; created_at?: unknown; updated_at?: unknown }>(
  value: T
): Omit<T, 'id' | 'created_at' | 'updated_at'> {
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = value;
  return rest;
}
