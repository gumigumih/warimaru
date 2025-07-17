import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">プライバシーポリシー</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">1. データの収集について</h3>
            <p className="text-sm leading-relaxed">
              わりまるは、お客様の個人情報を収集いたしません。入力された支払い情報は、お客様のブラウザ内でのみ処理され、外部サーバーに送信されることはありません。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2. データの保存について</h3>
            <p className="text-sm leading-relaxed">
              入力されたデータは、お客様のブラウザのローカルストレージに一時的に保存されます。ページを閉じると、データは自動的に削除されます。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">3. 第三者への提供について</h3>
            <p className="text-sm leading-relaxed">
              お客様の個人情報や入力データを第三者に提供することはありません。すべての計算処理は、お客様のブラウザ内で完結します。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">4. アクセス解析について</h3>
            <p className="text-sm leading-relaxed">
              本サイトでは、Google Analyticsを使用してアクセス解析を行っています。これにより、サイトの利用状況を把握し、サービスの改善に役立てています。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">5. お問い合わせ</h3>
            <p className="text-sm leading-relaxed">
              プライバシーポリシーに関するお問い合わせは、GitHubのIssuesページからお願いいたします。
            </p>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            最終更新日: 2025年06月24日
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}; 