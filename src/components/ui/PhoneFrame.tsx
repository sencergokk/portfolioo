import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Lightweight CSS iPhone frame (no images) that scales with its width. */
export function PhoneFrame({
  children,
  className,
  screenClassName,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[250px] rounded-[46px] bg-[linear-gradient(145deg,#2a2a2f,#0d0d10_40%,#1b1b1f)] p-[9px]",
        "shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_50px_100px_-30px_rgb(0_0_0/0.9),0_30px_60px_-40px_var(--a1,#000)]",
        className,
      )}
    >
      {/* side buttons */}
      <span aria-hidden className="absolute top-[22%] -left-[2px] h-10 w-[3px] rounded-l bg-[#26262b]" />
      <span aria-hidden className="absolute top-[31%] -left-[2px] h-14 w-[3px] rounded-l bg-[#26262b]" />
      <span aria-hidden className="absolute top-[27%] -right-[2px] h-20 w-[3px] rounded-r bg-[#26262b]" />
      <div className={cn("relative h-full w-full overflow-hidden rounded-[38px] bg-black", screenClassName)}>
        <span
          aria-hidden
          className="absolute top-[9px] left-1/2 z-30 h-[25px] w-[82px] -translate-x-1/2 rounded-full bg-black"
        />
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-6 text-[11px] font-semibold text-white/90">
          <span>9:41</span>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="flex h-2.5 items-end gap-[1.5px]">
              {[4, 6, 8, 10].map((h) => (
                <span key={h} className="w-[2.5px] rounded-sm bg-white/90" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-white/60 p-[1px]">
              <span className="block h-full w-3/4 rounded-[1.5px] bg-white/90" />
            </span>
          </span>
        </div>
        {children}
        <span
          aria-hidden
          className="absolute bottom-2 left-1/2 z-30 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-white/70"
        />
      </div>
    </div>
  );
}
