import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  sparkles: (
    <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3zM19 14l.9 2.2 2.1.7-2.1.7L19 20l-.9-2.4-2.1-.7 2.1-.7L19 14z" />
  ),
  shield: (
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zm-1 11l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z" />
  ),
  chart: (
    <path d="M4 20V4h2v14h14v2H4zm4-3V9h2v8H8zm4 0V6h2v11h-2zm4 0v-5h2v5h-2z" />
  ),
  wallet: (
    <path d="M3 6a2 2 0 012-2h12v2H5v12h14v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm16 3a2 2 0 012 2v2a2 2 0 01-2 2h-4a3 3 0 010-6h4zm-4 2a1 1 0 000 2h4v-2h-4z" />
  ),
  clipboard: (
    <path d="M9 2h6a1 1 0 011 1v1h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2V3a1 1 0 011-1zm0 4H6v14h12V6h-3v1H9V6zm0-2v1h6V4H9z" />
  ),
  chat: (
    <path d="M4 4h16a1 1 0 011 1v12a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1zm3 5v2h10V9H7zm0 4v2h6v-2H7z" />
  ),
  star: <path d="M12 2l3 6.5L22 9.3l-5 4.8 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.8 7-.8L12 2z" />,
  arrow: <path d="M5 12h12l-5-5 1.4-1.4L21 12l-7.6 6.4L12 17l5-5H5v-1z" />,
  check: <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" />,
  location: (
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 4.5A2.5 2.5 0 109.5 9 2.5 2.5 0 0012 6.5z" />
  ),
  play: <path d="M8 5v14l11-7L8 5z" />,
  home: <path d="M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />,
  search: (
    <path d="M10 4a6 6 0 104 10.5l5 5 1.4-1.4-5-5A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
  ),
  calendar: (
    <path d="M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 7v10H5V9h14z" />
  ),
  bell: (
    <path d="M12 2a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V8a6 6 0 00-6-6zm0 20a3 3 0 003-3H9a3 3 0 003 3z" />
  ),
  menu: <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />,
  logout: (
    <path d="M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5v-2H5V5h5V3zm7 4-1.4 1.4L18.2 11H9v2h9.2l-2.6 2.6L17 17l5-5-5-5z" />
  ),
  settings: (
    <path d="M5 4v6H3v2h2v8h2v-8h2v-2H7V4H5zm12 0v2h-2v2h2v12h2V8h2V6h-2V4h-2zM11 4v10H9v2h2v4h2v-4h2v-2h-2V4h-2z" />
  ),
  user: (
    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v0h18v0c0-3.5-4-6-9-6z" />
  ),
  dumbbell: (
    <path d="M4 9H3v6h1v-2h2V11H4V9zm16 0v2h-2v2h2v2h1V9h-1zM7 6h2v12H7V6zm8 0h2v12h-2V6zM9 11h6v2H9v-2z" />
  ),
  flag: <path d="M5 3h13l-3 5 3 5H7v8H5V3z" />,
};

export function Icon({
  name,
  ...props
}: { name: keyof typeof paths | string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {paths[name] ?? null}
    </svg>
  );
}
