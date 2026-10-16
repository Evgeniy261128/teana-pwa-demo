"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    /*
     * Внешний контейнер — центрирует «телефон» на десктопе.
     * На мобильном занимает весь экран.
     */
    <div className="min-h-screen bg-neutral-50 flex items-start justify-center md:py-8">

      {/*
       * «Экран телефона»:
       * — на мобильном: w-full, min-h-screen
       * — на десктопе:  max-w-sm, скругления, тень
       */}
      <div
        className="relative w-full max-w-md mx-auto md:rounded-[2.5rem] md:shadow-2xl md:overflow-hidden flex flex-col min-h-screen md:min-h-[800px] md:max-h-[900px] bg-neutral-50 shadow-2xl overflow-hidden"
      >
        {/* Фиксированная шапка — только не на главной */}
        {!isHome && <Header />}

        {/* Основной скроллируемый контент */}
        <main
          className="flex-1 overflow-y-auto w-full"
          style={{
            paddingTop: !isHome ? "64px" : "0px",
            paddingBottom: !isHome ? "80px" : "0px",
          }}
        >
          {children}
        </main>

        {/* Нижняя навигация — только не на главной */}
        {!isHome && <BottomNav />}

        {/* Всплывающий промпт установки */}
        <InstallPrompt />
      </div>
    </div>
  );
}
