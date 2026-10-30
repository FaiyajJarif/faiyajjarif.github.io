// Personal mark: an "FJ" monogram on a dark world, wrapped in a tilted orbit (an accretion
// disk / satellite path) with a small satellite travelling round it. Software + hardware + space.
export function LogoMark({ size = 40, animated = true, title = 'Faiyaj Jarif logo' }) {
  const id = `lg${size}${animated ? 'a' : 's'}`;
  const orbit = 'M3 32a29 9 0 1 0 58 0a29 9 0 1 0 -58 0';
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={title}>
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#ffad55" />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#1f2950" />
          <stop offset="1" stopColor="#05060d" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#ffad55" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffad55" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill={`url(#${id}-glow)`} />
      {/* back half of the orbit, behind the world */}
      <g transform="rotate(-20 32 32)">
        <path d="M3 32a29 9 0 0 1 58 0" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="1.8" opacity="0.45" />
      </g>
      <circle cx="32" cy="32" r="16" fill={`url(#${id}-core)`} stroke="#ffd08a" strokeWidth="1.4" />
      <g fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 37V23.5h8.5 M25 29.8h6" />
        <path d="M38.5 23.5v8a4 4 0 0 1-7.4 2.1" />
      </g>
      {/* front half of the orbit + satellite */}
      <g transform="rotate(-20 32 32)">
        <path d="M61 32a29 9 0 0 1-58 0" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="2.4" />
        <circle r="2.6" fill="#8fd3ff" cx={animated ? 0 : 61} cy={animated ? 0 : 32}>
          {animated && <animateMotion dur="8s" repeatCount="indefinite" path={orbit} />}
        </circle>
      </g>
    </svg>
  );
}

export default function Logo({ size = 36 }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="wordmark">
        <span className="wm-name">
          FAIYAJ <span className="wm-accent">JARIF</span>
        </span>
        <span className="wm-tag">full stack · robotics</span>
      </span>
    </span>
  );
}
