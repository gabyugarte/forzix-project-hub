/** Mapa estilizado del Perú. No representa datos de cobertura específicos. */
export function PeruMap() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <svg
        viewBox="0 0 300 380"
        role="img"
        aria-label="Silueta estilizada del Perú"
        className="mx-auto h-auto w-full max-w-[280px]"
      >
        <path
          d="M96 12 128 30 150 22 170 40 196 44 214 68 236 84 252 118 240 140 250 166 236 190 210 206 200 232 178 252 168 286 150 314 128 344 110 366 92 352 100 322 84 296 92 268 72 246 62 214 44 190 52 160 40 132 56 104 50 74 70 52 78 26Z"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {[
          [120, 90],
          [160, 150],
          [110, 210],
          [150, 268],
          [190, 110],
          [96, 300],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="var(--color-primary)" />
        ))}
      </svg>
    </div>
  );
}
