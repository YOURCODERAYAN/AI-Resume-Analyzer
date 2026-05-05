
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  let i: number = 0;

  while (bytes >= 1024 && i < sizes.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${sizes[i]}`;
}
