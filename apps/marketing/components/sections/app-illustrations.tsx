'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

/**
 * Brand Tokens - Adaptive to light/dark via CSS variables
 */
const tokens = {
  accent: '#ED4B00', // Kimchi Orange
  cyan: '#00F2FF', // GateFlow Cyan (Technology Lifeblood)
  success: '#00C853',
  border: 'rgba(255, 255, 255, 0.1)',
  glass: 'rgba(255, 255, 255, 0.03)',
};

const GlowFilter = ({ id }: { id: string }) => (
  <defs>
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={tokens.accent} />
      <stop offset="100%" stopColor="#FF8C00" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={tokens.cyan} stopOpacity="0.4" />
      <stop offset="100%" stopColor={tokens.cyan} stopOpacity="0" />
    </linearGradient>
  </defs>
);

export const DashboardIllustration = () => (
  <svg
    viewBox="0 0 1000 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full bg-ds-surface-overlay text-ds-text-heading"
  >
    <GlowFilter id="glow-orange" />

    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path
        d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.03"
        strokeWidth="1"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)" />

    {/* Sidebar Structure */}
    <rect width="200" height="600" fill="currentColor" fillOpacity="0.02" />
    <rect
      x="25"
      y="40"
      width="150"
      height="32"
      rx="10"
      fill={tokens.accent}
      fillOpacity="0.1"
      stroke={tokens.accent}
      strokeOpacity="0.2"
    />
    <circle cx="45" cy="56" r="6" fill={tokens.accent} />
    <rect
      x="60"
      y="52"
      width="70"
      height="8"
      rx="2"
      fill="currentColor"
      fillOpacity="0.6"
    />

    {/* High Density Analytics Row */}
    <rect
      x="220"
      y="30"
      width="750"
      height="80"
      rx="16"
      fill="currentColor"
      fillOpacity="0.015"
      stroke="currentColor"
      strokeOpacity="0.05"
    />
    <text
      x="240"
      y="55"
      fill="currentColor"
      fillOpacity="0.3"
      fontSize="9"
      fontWeight="900"
      letterSpacing="0.2em"
    >
      LIVE PERIMETER METRICS
    </text>
    {[240, 420, 600, 780].map((x, i) => (
      <g key={x}>
        <rect
          x={x}
          y="65"
          width="150"
          height="30"
          rx="8"
          fill="currentColor"
          fillOpacity="0.03"
        />
        <rect
          x={x + 10}
          y="75"
          width="60"
          height="10"
          rx="2"
          fill={i === 1 ? tokens.cyan : 'currentColor'}
          fillOpacity={i === 1 ? 0.8 : 0.2}
        />
      </g>
    ))}

    {/* Main Map Viewport (Smaller to fit analytics) */}
    <rect
      x="220"
      y="130"
      width="500"
      height="250"
      rx="20"
      fill="currentColor"
      fillOpacity="0.01"
      stroke="currentColor"
      strokeOpacity="0.05"
    />

    {/* Map Nodes */}
    {[
      { x: 350, y: 200 },
      { x: 550, y: 250 },
      { x: 450, y: 320 },
    ].map((pos, i) => (
      <g key={i}>
        <motion.circle
          cx={pos.x}
          cy={pos.y}
          r="20"
          fill={tokens.cyan}
          fillOpacity="0.05"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
        <circle cx={pos.x} cy={pos.y} r="3" fill={tokens.cyan} />
      </g>
    ))}

    {/* Right Panel Charts */}
    <rect
      x="740"
      y="130"
      width="230"
      height="250"
      rx="20"
      fill="currentColor"
      fillOpacity="0.03"
      stroke="currentColor"
      strokeOpacity="0.1"
    />
    <path
      d="M 760 300 Q 800 240, 840 280 T 920 220"
      stroke={tokens.cyan}
      strokeWidth="2"
      strokeOpacity="0.5"
      fill="none"
    />
    <rect
      x="760"
      y="150"
      width="120"
      height="8"
      rx="2"
      fill="currentColor"
      fillOpacity="0.3"
    />

    {/* Live Data Ticker */}
    <rect
      x="220"
      y="400"
      width="750"
      height="170"
      rx="20"
      fill="currentColor"
      fillOpacity="0.03"
      stroke="currentColor"
      strokeOpacity="0.1"
    />
    {[450, 485, 520].map((y, i) => (
      <g key={y}>
        <rect
          x="240"
          y={y}
          width="710"
          height="24"
          rx="6"
          fill="currentColor"
          fillOpacity="0.02"
        />
        <rect
          x="255"
          y={y + 8}
          width="80"
          height="8"
          rx="2"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <rect
          x="350"
          y={y + 8}
          width="400"
          height="8"
          rx="2"
          fill="currentColor"
          fillOpacity="0.05"
        />
        <rect
          x="910"
          y={y + 8}
          width="24"
          height="8"
          rx="4"
          fill={tokens.success}
          fillOpacity="0.5"
        />
      </g>
    ))}
  </svg>
);

export const ScannerIllustration = () => (
  <svg
    viewBox="0 0 340 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full bg-ds-surface-overlay text-ds-text-heading"
  >
    <GlowFilter id="glow-cyan" />

    <rect
      x="110"
      y="15"
      width="120"
      height="6"
      rx="3"
      fill="currentColor"
      fillOpacity="0.1"
    />

    {/* Viewfinder Detail Enhancement */}
    <rect
      x="30"
      y="70"
      width="280"
      height="280"
      rx="32"
      fill={tokens.cyan}
      fillOpacity="0.03"
      stroke={tokens.cyan}
      strokeOpacity="0.1"
    />
    <motion.path
      d="M 40 80 L 300 80"
      stroke={tokens.cyan}
      strokeWidth="2"
      animate={{ y: [0, 260, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Resident Meta Info (New Density) */}
    <g transform="translate(40, 365)">
      <rect
        width="260"
        height="120"
        rx="16"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="currentColor"
        strokeOpacity="0.05"
      />
      <rect
        x="15"
        y="15"
        width="40"
        height="40"
        rx="8"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <rect
        x="70"
        y="20"
        width="120"
        height="10"
        rx="2"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <rect
        x="70"
        y="38"
        width="80"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />

      <line
        x1="15"
        y1="70"
        x2="245"
        y2="70"
        stroke="currentColor"
        strokeOpacity="0.1"
      />

      <rect
        x="15"
        y="85"
        width="70"
        height="12"
        rx="4"
        fill={tokens.success}
        fillOpacity="0.1"
        stroke={tokens.success}
        strokeOpacity="0.3"
      />
      <rect x="25" y="91" width="50" height="1" fill={tokens.success} />
      <text
        x="160"
        y="96"
        fill="currentColor"
        fillOpacity="0.4"
        fontSize="8"
        fontWeight="900"
        letterSpacing="0.1em"
      >
        SCAN 1284-B
      </text>
    </g>

    {/* Success Animation */}
    <motion.circle
      cx="170"
      cy="530"
      r="30"
      fill={tokens.success}
      fillOpacity="0.1"
      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <circle cx="170" cy="530" r="20" fill={tokens.success} />
    <path
      d="M 162 530 L 168 536 L 178 526"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PortalIllustration = () => (
  <svg
    viewBox="0 0 1000 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full bg-ds-surface-overlay text-ds-text-heading"
  >
    <rect width="1000" height="80" fill="currentColor" fillOpacity="0.02" />
    <rect x="40" y="24" width="32" height="32" rx="8" fill={tokens.accent} />
    <rect
      x="85"
      y="34"
      width="100"
      height="12"
      rx="3"
      fill="currentColor"
      fillOpacity="0.1"
    />

    {/* Pass Creation Details */}
    <rect
      x="40"
      y="110"
      width="440"
      height="450"
      rx="24"
      fill="currentColor"
      fillOpacity="0.015"
      stroke="currentColor"
      strokeOpacity="0.05"
    />
    <text
      x="70"
      y="145"
      fill="currentColor"
      fillOpacity="0.4"
      fontSize="10"
      fontWeight="900"
      letterSpacing="0.2em"
    >
      PASS CONFIGURATION
    </text>
    {[170, 230, 290, 350].map((y) => (
      <rect
        key={y}
        x="70"
        y={y}
        width="380"
        height="40"
        rx="12"
        fill="currentColor"
        fillOpacity="0.03"
      />
    ))}
    <rect x="70" y="440" width="380" height="50" rx="16" fill={tokens.accent} />
    <text
      x="175"
      y="472"
      fill="white"
      fontSize="12"
      fontWeight="900"
      letterSpacing="0.2em"
    >
      CREATE SECURE PASS
    </text>

    {/* Quota & Notification Log */}
    <rect
      x="520"
      y="110"
      width="440"
      height="210"
      rx="24"
      fill="currentColor"
      fillOpacity="0.015"
      stroke="currentColor"
      strokeOpacity="0.05"
    />
    <circle cx="560" cy="150" r="20" fill={tokens.cyan} fillOpacity="0.1" />
    <rect
      x="600"
      y="145"
      width="180"
      height="10"
      rx="2"
      fill="currentColor"
      fillOpacity="0.6"
    />
    <rect
      x="560"
      y="190"
      width="360"
      height="12"
      rx="4"
      fill="currentColor"
      fillOpacity="0.05"
    />
    <motion.rect
      x="560"
      y="190"
      width="280"
      height="12"
      rx="4"
      fill={tokens.cyan}
    />

    <rect
      x="520"
      y="350"
      width="440"
      height="210"
      rx="24"
      fill="currentColor"
      fillOpacity="0.015"
      stroke="currentColor"
      strokeOpacity="0.05"
    />
    <text
      x="550"
      y="385"
      fill="currentColor"
      fillOpacity="0.4"
      fontSize="10"
      fontWeight="900"
      letterSpacing="0.2em"
    >
      LIVE ARRIVAL LOG
    </text>
    {[410, 460, 510].map((y) => (
      <rect
        key={y}
        x="550"
        y={y}
        width="380"
        height="35"
        rx="12"
        fill="currentColor"
        fillOpacity="0.02"
      />
    ))}
  </svg>
);
