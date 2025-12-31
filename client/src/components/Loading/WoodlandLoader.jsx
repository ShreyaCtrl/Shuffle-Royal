const WoodlandLoader = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .draw { stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw 2s infinite alternate ease-in-out; }
      @keyframes draw { to { stroke-dashoffset: 0; } }
    `}</style>
    <path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke="var(--theme-woodland-brown)" strokeWidth="2" opacity="0.2" />
    <path className="draw" d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke="var(--theme-woodland-green)" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="10" r="5" fill="var(--theme-woodland-leaf)" />
  </svg>
);

export default WoodlandLoader;
