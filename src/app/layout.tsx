import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Pulse | Private Intelligence Copilot",
  description: "Next-generation workspace for document intelligence and neural chat.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch roles for the sidebar if logged in
  let role = "VIEWER";
  if (user) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { profileId: user.id },
      select: { role: true },
    });
    if (membership) role = membership.role;
  }

  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="app-body">
        <div className="layout-root">
          <Sidebar user={user} role={role} />
          <main className="content-area">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
