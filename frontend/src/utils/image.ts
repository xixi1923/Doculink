export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-b5c74841fa6f4115940d4354956c0d0d.r2.dev';
  // Ensure we don't have double slashes except for ://
  return `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};
