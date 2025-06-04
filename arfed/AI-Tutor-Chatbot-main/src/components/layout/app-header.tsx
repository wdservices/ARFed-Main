import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, MessageSquareText } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <MessageSquareText className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-semibold">AI Tutor</span>
        </Link>
        <nav>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
