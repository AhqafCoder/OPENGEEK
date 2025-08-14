import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, BarChart3, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type NavItemType = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItemType[] = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Content', href: '/admin/content', icon: FileText },
  ];

  const NavItem = ({ item }: { item: NavItemType }) => (
    <Link
      to={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        location.pathname === item.href
          ? 'bg-muted text-primary'
          : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </Link>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-6 w-6" />
              <span className="sr-only">Admin Panel</span>
            </div>
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/admin" className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  console.log('Logout clicked');
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
