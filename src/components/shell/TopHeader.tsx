import React, { useState } from 'react';
import { BrandMark } from '../brand/BrandMark';
import { ShieldCheck, Bell, Radio, FileSpreadsheet, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CentralExportModal } from '../CentralExportModal';
import { UserProfileModal } from '../UserProfileModal';
import { NoticeBoardModal } from '../NoticeBoardModal';
import { CommandPalette } from '../CommandPalette';

export const TopHeader: React.FC = () => {
  const { user, role } = useAuth();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNoticeBoardOpen, setIsNoticeBoardOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <div className="w-full z-40 select-none">
      <header className="w-full bg-olive-deep text-snow border-b border-sand/30 shadow-subtle">
        {/* Central Logistics & Ration Supply Classification Bar */}
        <div className="w-full px-4 md:px-8 py-2.5 text-[11px] font-body flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Swappable Brand Crest & Wordmark */}
          <div className="flex items-center gap-3">
            <BrandMark variant="shield" size={26} className="shrink-0 drop-shadow-sm" />
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold tracking-wider text-xs md:text-sm text-snow">
                HIMRASAD
              </span>
              <span className="text-sand/60">|</span>
              <span className="hidden sm:inline font-heading font-semibold text-[10px] tracking-widest text-sand uppercase truncate">
                Institutional Ration Supply Command
              </span>
            </div>
          </div>

          {/* Right: Operational Status, Search, Profile, Export & Alerts */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden lg:flex items-center gap-1.5 text-sand">
              <Radio className="w-3.5 h-3.5 text-success animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-snow font-bold">
                OPS: ONLINE
              </span>
            </div>

            <span className="hidden lg:inline text-sand/40">•</span>

            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-snow/10 hover:bg-snow/20 text-snow border border-sand/40 text-[10px] font-heading font-bold transition-all shadow-subtle"
              title="Quick Search & Actions (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-gold" />
              <span className="hidden md:inline">QUICK ACTIONS</span>
              <kbd className="hidden xl:inline font-mono text-[9px] px-1 py-0.2 rounded bg-night/60 text-sand border border-sand/30">
                ⌘K
              </kbd>
            </button>

            {/* Central Export Hub */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 text-[10px] font-heading font-bold transition-all shadow-subtle"
              title="Central Export Hub & CSV Downloads"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-gold" />
              <span className="hidden sm:inline">EXPORT HUB</span>
            </button>

            {/* Operational Notice Board Bell */}
            <button
              type="button"
              onClick={() => setIsNoticeBoardOpen(true)}
              className="p-1.5 rounded-control text-sand hover:text-snow hover:bg-olive/40 transition-colors relative"
              title="Station Operational Notice Board"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saffron" />
            </button>

            {/* Personnel Profile Button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-control bg-olive hover:bg-olive/80 text-snow border border-sand/40 text-[10px] font-heading font-bold transition-all shadow-subtle"
              title="Station Personnel Profile & Credentials"
            >
              <div className="w-4 h-4 rounded-full bg-gold text-night flex items-center justify-center font-bold text-[9px] shrink-0">
                {user?.name?.charAt(0) || 'O'}
              </div>
              <span className="hidden sm:inline max-w-[110px] truncate">{user?.name?.split(' ')[0] || 'Profile'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Signature 3px Gold Line beneath the Top Bar */}
      <div className="h-[3px] w-full bg-gold shadow-sm" />

      {/* Modals */}
      <CentralExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <NoticeBoardModal isOpen={isNoticeBoardOpen} onClose={() => setIsNoticeBoardOpen(false)} />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNoticeBoard={() => setIsNoticeBoardOpen(true)}
        onOpenExportHub={() => setIsExportOpen(true)}
      />
    </div>
  );
};

export default TopHeader;
