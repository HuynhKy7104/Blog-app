"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

type Props = PropsWithChildren<{
  triggerIcon: ReactNode;
  triggerClassName?: string;
}>;

const Sidebar = ({ triggerIcon, triggerClassName, children }: Props) => {
  const [show, setShow] = useState(false);

  const ref = useRef<HTMLDivElement>(null!);
  useOnClickOutside(ref, () => setShow(false));

  return (
    <>
      <button
        className={triggerClassName}
        onClick={() => setShow((prev) => !prev)}
      >
        {triggerIcon}
      </button>
      <div
        ref={ref}

        className={cn(
          "w-60 absolute duration-300 top-0 z-10 transition-all bg-space text-primary-50 rounded-r-md min-h-screen",
          {
            "-left-full": !show,
            "left-0": show,
          },
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
