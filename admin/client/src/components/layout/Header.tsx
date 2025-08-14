import { Link } from 'react-router-dom';
import { 
  BarChart3,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-6 w-6" />
              <span>Admin Panel</span>
            </div>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/admin" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Users
              </Link>
              <Link 
                to="/admin/content" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Content
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      <DarkModeToggle />
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          // Logout functionality would go here
          console.log('Logout clicked');
        }}
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Logout</span>
      </Button>
    </header>
  );
};

export default Header;
