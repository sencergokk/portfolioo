import {
  Check,
  Flame,
  Headphones,
  Lock,
  Moon,
  Pause,
  PlugZap,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Vibrate,
} from "lucide-react";
import Image from "next/image";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

/* Hand-built, image-free UI mocks. They illustrate each app's core loop and scale with the frame. */

const Bars = ({ count = 28, className = "" }: { count?: number; className?: string }) => (
  <span aria-hidden className={`flex h-7 items-center gap-[2px] ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className="w-[2px] origin-center rounded-full bg-current [animation:wave_1.4s_ease-in-out_infinite]"
        style={{
          height: `${30 + ((i * 37) % 70)}%`,
          animationDelay: `${(i % 7) * 0.12}s`,
        }}
      />
    ))}
  </span>
);

/* -------------------------------------------------------------------------- */

/** Intrinsic sizes of the mocks; ScaleToFit scales them into the card. */
export const MOCK_SIZE = { phone: [250, 542], fan: [560, 500] } as const;

export function HaliSahaVisual() {
  const shots = [
    {
      src: "/apps/halisaha-upgrades.jpg",
      alt: "Halı Saha Tycoon yükseltmeler ekranı",
      cls: "-translate-x-[118%] translate-y-[-44%] -rotate-[9deg] group-hover:-translate-x-[130%] group-hover:-rotate-[12deg]",
    },
    {
      src: "/apps/halisaha-branches.jpg",
      alt: "Halı Saha Tycoon şubeler ekranı",
      cls: "translate-x-[18%] translate-y-[-44%] rotate-[9deg] group-hover:translate-x-[30%] group-hover:rotate-[12deg]",
    },
    {
      src: "/apps/halisaha-pitch.jpg",
      alt: "Halı Saha Tycoon saha ekranı",
      cls: "z-10 -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-[53%]",
    },
  ];
  return (
    <div className="group relative" style={{ width: MOCK_SIZE.fan[0], height: MOCK_SIZE.fan[1] }}>
      {shots.map((s) => (
        <div
          key={s.src}
          className={`absolute top-1/2 left-1/2 w-[200px] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${s.cls}`}
        >
          <Image src={s.src} alt={s.alt} width={645} height={1398} sizes="220px" className="h-auto w-full" />
        </div>
      ))}
      <div className="absolute bottom-0 left-2 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/80 p-2 pr-4">
        <Image
          src="/apps/halisaha-icon.png"
          alt="Halı Saha Tycoon uygulama ikonu"
          width={88}
          height={88}
          className="h-11 w-11 rounded-[11px]"
        />
        <div className="text-xs leading-tight">
          <p className="font-medium text-white">Soccer Field Tycoon</p>
          <p className="text-white/60">Idle Sim · 7 dil</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function KpssVisual() {
  const options = [
    { k: "A", t: "Orhan Bey", ok: true },
    { k: "B", t: "I. Murat" },
    { k: "C", t: "Yıldırım Bayezid" },
    { k: "D", t: "II. Mehmet" },
  ];
  return (
    <PhoneFrame screenClassName="bg-[linear-gradient(180deg,#0e1330,#0a0d20)]">
      <div className="flex h-full flex-col px-4 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-bold tracking-tight">
            KPSS <span className="text-[#8fa6ff]">GO</span>
          </p>
          <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-300">
            <Flame size={11} /> 12 gün
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] text-white/60">
          <span>Tarih · Soru 14/40</span>
          <span>%35</span>
        </div>
        <div className="mt-1.5 h-1 rounded-full bg-white/10">
          <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#4f7cff] to-[#9b8cff]" />
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="text-[12.5px] leading-snug font-medium">
            Osmanlı Devleti&apos;nde ilk düzenli ordu hangi padişah döneminde kurulmuştur?
          </p>
        </div>
        <ul className="mt-3 space-y-2">
          {options.map((o) => (
            <li
              key={o.k}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[11.5px] ${
                o.ok
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/[0.03] text-white/80"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-md text-[10px] font-bold ${o.ok ? "bg-emerald-400 text-emerald-950" : "bg-white/10"}`}
              >
                {o.ok ? <Check size={12} strokeWidth={3} /> : o.k}
              </span>
              {o.t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#4f7cff] to-[#7c6cff] p-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20">
            <Headphones size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10.5px] font-semibold">Sesli Not · İnkılap Tarihi</p>
            <Bars count={22} className="h-4 text-white/80" />
          </div>
          <span className="text-[10px] text-white/80 tabular-nums">03:12</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* -------------------------------------------------------------------------- */

export function TheftVisual() {
  const modes = [
    { icon: Vibrate, label: "Motion", on: true },
    { icon: PlugZap, label: "Charger" },
    { icon: Smartphone, label: "Pocket" },
  ];
  return (
    <PhoneFrame screenClassName="bg-[radial-gradient(120%_70%_at_50%_30%,#1a2240,#0b1120_60%)]">
      <div className="flex h-full flex-col items-center px-4 pt-12 pb-6 text-white">
        <div className="flex w-full items-center justify-between">
          <p className="flex items-center gap-1.5 text-[14px] font-bold">
            <Shield size={15} className="text-amber-400" /> Theft Alarm
          </p>
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">PRO</span>
        </div>

        <div className="relative mt-9 grid h-40 w-40 place-items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full border border-amber-400/40 [animation:ring_2.8s_ease-out_infinite]"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          ))}
          <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-b from-amber-400 to-orange-600 shadow-[0_0_60px_-5px_rgb(245_158_11/0.7)]">
            <div className="text-center">
              <Lock size={26} className="mx-auto" />
              <p className="mt-1 text-[11px] font-bold tracking-[0.2em]">ARMED</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-[12px] text-white/70">Motion detection is active</p>

        <div className="mt-6 grid w-full grid-cols-3 gap-2">
          {modes.map(({ icon: Icon, label, on }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-[10px] ${
                on
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/[0.03] text-white/60"
              }`}
            >
              <Icon size={16} />
              {label}
            </div>
          ))}
        </div>

        <div className="mt-auto flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <span className="text-[11px] text-white/70">Disarm with PIN</span>
          <span className="flex gap-1.5" aria-hidden>
            {[1, 1, 0, 0].map((f, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${f ? "bg-amber-400" : "bg-white/20"}`} />
            ))}
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* -------------------------------------------------------------------------- */

export function MasalVisual() {
  return (
    <PhoneFrame screenClassName="bg-[linear-gradient(180deg,#1b1033,#120a24)]">
      <div className="flex h-full flex-col px-4 pt-12 pb-6 text-white">
        <p className="flex items-center gap-1.5 text-[14px] font-bold">
          <Sparkles size={14} className="text-fuchsia-300" /> MasalAI
        </p>

        <div className="relative mt-4 h-40 overflow-hidden rounded-2xl bg-[radial-gradient(90%_80%_at_70%_20%,#6d3fd1,#2a145a_60%,#170c33)]">
          {[
            [18, 22],
            [70, 14],
            [40, 40],
            [85, 48],
            [25, 62],
            [60, 30],
          ].map(([x, y], i) => (
            <Star
              key={i}
              aria-hidden
              size={i % 2 ? 7 : 10}
              className="absolute fill-amber-100 text-amber-100 [animation:twinkle_2.6s_ease-in-out_infinite]"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
            />
          ))}
          <Moon
            aria-hidden
            size={46}
            className="absolute top-5 right-6 fill-amber-100 text-amber-100 drop-shadow-[0_0_18px_rgb(254_243_199/0.7)]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[radial-gradient(60%_100%_at_30%_100%,#0f2a22,transparent),radial-gradient(70%_100%_at_85%_100%,#0b2019,transparent)]" />
        </div>

        <p className="mt-4 text-[10px] tracking-[0.18em] text-fuchsia-200/70 uppercase">Bölüm 1 · 6 dk</p>
        <p className="mt-1 font-serif text-[19px] leading-tight">Ay Işığındaki Tilki</p>
        <p className="mt-2 text-[11.5px] leading-relaxed text-white/70">
          Ormanın en sessiz köşesinde, her gece ay ışığını minik bir kavanoza toplayan meraklı bir tilki yaşarmış…
        </p>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.05] p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500">
              <Pause size={15} className="fill-white" />
            </span>
            <Bars count={24} className="flex-1 text-fuchsia-200/80" />
          </div>
          <div className="mt-2 flex justify-between text-[9.5px] text-white/50 tabular-nums">
            <span>01:48</span>
            <span>06:02</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
