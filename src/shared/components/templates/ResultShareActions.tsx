import { useState, type RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { captureElementToImage } from '../../../infrastructure/html2canvas';
import { withDownloadBanner } from '../../../infrastructure/downloadBanner';

interface ResultShareActionsProps {
  resultRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
  buttonClassName: string;
  downloadFilename: string;
  shareTitle: string;
  shareUrl: string;
  shareText?: string;
  shareLabel?: string;
  copyLabel?: string;
  showCopyAlert?: boolean;
  onBeforeDownload?: (element: HTMLElement) => (() => void) | void;
}

const timestamp = () => {
  const now = new Date();
  return now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
};

export const ResultShareActions = ({
  resultRef,
  disabled = false,
  buttonClassName,
  downloadFilename,
  shareTitle,
  shareUrl,
  shareText,
  shareLabel = 'シェア',
  copyLabel = 'URLコピー',
  showCopyAlert = false,
  onBeforeDownload,
}: ResultShareActionsProps) => {
  const [shareMsg, setShareMsg] = useState('');
  const isWebShareSupported = typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) &&
    typeof navigator.share === 'function';

  const handleDownload = async () => {
    const element = resultRef.current;
    if (!element) return;

    const cleanup = onBeforeDownload?.(element);
    try {
      const canvas = await withDownloadBanner(element, () => captureElementToImage(element));
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${downloadFilename}_${timestamp()}.png`;
      link.click();
    } catch (error) {
      console.error('画像の生成に失敗しました:', error);
      setShareMsg('画像の生成に失敗しました');
    } finally {
      cleanup?.();
    }
  };

  const handleShare = async () => {
    try {
      if (isWebShareSupported) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShareMsg('シェアしました！');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareMsg('URLをコピーしました！');
        if (showCopyAlert) alert('URLをコピーしました！');
      }
    } catch {
      setShareMsg(isWebShareSupported ? 'シェアをキャンセルしました' : 'コピーに失敗しました');
    }
    window.setTimeout(() => setShareMsg(''), 2000);
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button onClick={handleDownload} disabled={disabled} className={`${buttonClassName} w-full text-base sm:text-lg`}>
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          画像保存
        </button>
        <button onClick={handleShare} disabled={disabled} className={`${buttonClassName} w-full text-base sm:text-lg`}>
          <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
          {isWebShareSupported ? shareLabel : copyLabel}
        </button>
      </div>
      {shareMsg && <p role="status" className="text-center text-emerald-700 font-semibold mt-1 text-sm">{shareMsg}</p>}
      <p className="text-xs text-slate-500 text-center">
        画像保存はロゴ入り・枠線付きで出力されます。共有前に内容を確認してください。
      </p>
    </div>
  );
};
