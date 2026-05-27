export const withDownloadBanner = async <T>(
  root: HTMLElement,
  callback: () => Promise<T>
) => {
  const banner = root.querySelector('[data-download-banner]') as HTMLElement | null;
  banner?.classList.remove('hidden');

  try {
    return await callback();
  } finally {
    banner?.classList.add('hidden');
  }
};
