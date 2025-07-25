'use client';

import {
  Home,
  Trophy,
  Monitor,
  Calendar,
  Code,
  MessageSquare,
  Hash,
  Settings,
  Users,
  Bookmark,
  HelpCircle,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  badge?: string | number;
}

const NavItem = ({ icon: Icon, label, href = "#", isActive, badge }: NavItemProps) => {
  const Component = href === "#" ? "a" : Link;

  return (
    <Component
      href={href}
      className={cn(
        'flex items-center py-2 px-3 rounded-md text-sm group transition-colors',
        isActive
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="ml-3 flex-1">{label}</span>
      {badge && (
        <span className="ml-auto bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">
          {badge}
        </span>
      )}
    </Component>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  const mainNavItems = [
    { icon: Home, label: 'Home', href: '/', isActive: pathname === '/' },
    { icon: Trophy, label: 'Leaderboards', badge: 'New' },
    { icon: Monitor, label: 'Project Showcase', href: '/projects', isActive: pathname === '/projects' },
    { icon: Calendar, label: 'Monthly Challenge' },
    { icon: Code, label: '#30NitesOfCode' },
    { icon: MessageSquare, label: 'General' },
    { icon: Users, label: 'Members' },
    { icon: Bookmark, label: 'Saved Posts', badge: 3 },
  ];



  return (
    <div className="h-full bg-black">
      <div className="flex flex-col h-full">
        {/* Main navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto py-6 px-3 no-scrollbar">
          <div className="space-y-4">
            {/* Main Navigation */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Main
              </h3>
              <nav className="space-y-1">
                {mainNavItems.map((item, index) => (
                  <NavItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isActive={item.isActive}
                    badge={item.badge}
                  />
                ))}
              </nav>
            </div>


          </div>
        </div>

        {/* Bottom section - Fixed */}
        <div className="p-3 border-t border-zinc-800 bg-black">
          <NavItem
            icon={Settings}
            label="Settings"
          />
          <NavItem
            icon={HelpCircle}
            label="Help & Support"
          />
        </div>
      </div>
    </div>
  );
} 