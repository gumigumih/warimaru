import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { PrivacyModal } from "./PrivacyModal";

export const Footer = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className="mt-8 pt-4 border-t border-white/20">
        <div className="flex flex-col items-center space-y-3 text-white/80 text-sm">
          {/* Sister App Section */}
          <div className="pt-2 w-full max-w-md mx-auto">
            <div className="text-center text-xs text-white/60 mb-2 tracking-widest">
              姉妹アプリ
            </div>
            <div className="flex justify-center">
              <a
                href="https://waketabe.meggumi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/80 border border-gray-200 hover:bg-white transition-colors shadow-sm w-full max-w-xs"
                title="わけたべ"
              >
                <img
                  src="https://waketabe.meggumi.com/ogp.png"
                  alt="わけたべOGP"
                  className="h-10 w-auto rounded-md object-cover flex-shrink-0"
                  style={{ aspectRatio: "16/9", minWidth: 56 }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-gray-900 leading-tight truncate">
                    わけたべ
                  </span>
                  <span className="text-xs text-gray-600 leading-tight truncate">
                    外食の“食べた分だけ”を
                    <br />
                    簡単に割り勘できるアプリ
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* GitHub & Links */}
          <div className="flex justify-center items-center space-x-4">
            <a
              href="https://github.com/gumigumih/warimaru"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="GitHubリポジトリ"
            >
              <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/gumigumih/warimaru/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="バグ報告・フィードバック"
            >
              バグ報告
            </a>
            <span>•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-white transition-colors"
              title="プライバシーポリシー"
            >
              プライバシー
            </button>
          </div>

          {/* Version & License */}
          <div className="flex justify-center items-center space-x-4">
            <span>
              v
              {typeof __APP_VERSION__ !== "undefined"
                ? __APP_VERSION__
                : "1.0.0"}
            </span>
            <span>•</span>
            <a
              href="https://github.com/gumigumih/warimaru/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="MITライセンス"
            >
              MIT License
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            © 2024 わりまる. All rights reserved.
          </div>
        </div>
      </footer>

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};
