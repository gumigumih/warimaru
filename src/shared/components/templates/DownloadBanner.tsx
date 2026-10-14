interface DownloadBannerProps {
  title: string;
  url: string;
}

export const DownloadBanner = ({ title, url }: DownloadBannerProps) => {
  return (
    <div
      data-download-banner
      className="mt-4 hidden rounded-2xl bg-slate-900 px-5 py-4 text-white"
    >
      <p className="text-center text-sm font-semibold">{title}</p>
      <p className="mt-1 text-center text-xs text-white/80">{url}</p>
    </div>
  );
};
