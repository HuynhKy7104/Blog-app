"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useState } from "react";

type Props = PropsWithChildren;

const DesktopNavbar = (props: Props) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isScrollDown = scrollPosition > 10;

  return (
    <nav
      className={cn(
        "hidden fixed w-full top-0 left-0 z-50 text-primary-50 transition-all duration-300 md:block",

        isScrollDown
          ? "bg-space/90 backdrop-blur-md shadow-lg shadow-primary-950/20"
          : "bg-linear-to-br from-primary-600 to-secondary-600",
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 container mx-auto">
        {props.children}
      </div>

      <hr className="border-t border-white/50" />
    </nav>
  );
};

export default DesktopNavbar;
