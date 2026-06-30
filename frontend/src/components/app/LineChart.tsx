"use client";

/**
 * Minimal dependency-free SVG line chart with a gradient area fill.
 */
export function LineChart({
  data,
  height = 220,
  stroke = "#7c5cff",
}: {
  data: { label: string; value: number }[];
  height?: number;
  stroke?: string;
}) {
  const width = 640;
  const padX = 32;
  const padY = 24;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const x = (i: number) =>
    padX + (i * (width - padX * 2)) / (data.length - 1);
  const y = (v: number) =>
    padY + (1 - (v - min) / range) * (height - padY * 2);

  const line = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
    .join(" ");
  const area = `${line} L ${x(data.length - 1)} ${height - padY} L ${x(0)} ${
    height - padY
  } Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Progress chart"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#areaFill)" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.value)} r={3.5} fill={stroke} />
          <text
            x={x(i)}
            y={height - 6}
            textAnchor="middle"
            className="fill-[#9a9aa6] text-[10px]"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
