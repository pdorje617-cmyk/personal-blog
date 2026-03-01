/**
 * Convert nanosecond bigint timestamps (ICP epoch) to human-readable strings.
 */
export function formatDate(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
