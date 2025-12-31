const ArcadeLoader = () => (
  <svg width="80" height="100" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .flip { animation: flipCard 1s steps(4) infinite; transform-origin: center; }
      @keyframes flipCard { 0% { transform: scaleX(1); } 50% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
    `}</style>
    <rect x="10" y="10" width="60" height="80" rx="4" fill="var(--theme-arcade-yellow)" className="flip" stroke="var(--theme-arcade-pink)" strokeWidth="4" />
    <rect x="25" y="30" width="30" height="40" fill="var(--theme-arcade-pink)" className="flip" opacity="0.5" />
  </svg>
);

export default ArcadeLoader;