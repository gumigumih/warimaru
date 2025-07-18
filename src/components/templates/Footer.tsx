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
