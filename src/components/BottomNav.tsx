"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BookOpen, MapPin, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/catalog",  label: "Каталог",  Icon: LayoutGrid },
  { href: "/recipes",  label: "Рецепты",  Icon: BookOpen    },
  { href: "/contacts", label: "Контакты", Icon: MapPin      },
  { href: "/profile",  label: "Профиль",  Icon: User        },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(123,26,46,0.10)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <ul className="flex items-center justify-around max-w-md mx-auto h-16 px-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-2 rounded-xl mx-1"
                style={{
                  color: isActive ? "#7b1a2e" : "#9ca3af",
                }}
              >
                {/* Иконка с индикатором */}
                <span className="relative flex items-center justify-center w-6 h-6">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    style={{
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  {/* Активная точка */}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#c9a43d" }}
                    />
                  )}
                </span>

                <span
                  className="text-[10px] font-medium tracking-wide"
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
