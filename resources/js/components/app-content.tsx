import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import { Toaster } from "@/components/ui/sonner";

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            <Toaster richColors position="top-right" />
            {children}
        </main>
    );
}
