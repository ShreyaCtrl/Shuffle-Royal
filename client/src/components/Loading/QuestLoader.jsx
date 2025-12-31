const QuestLoader = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .pulse { animation: pulse 2s infinite ease-in-out; transform-origin: center; }
      @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 0.3; } }
      .spin { animation: spin 4s linear infinite; transform-origin: center; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--theme-quest-purple)" strokeWidth="2" strokeDasharray="10 5" className="spin" />
    <path d="M50 20 L80 70 L20 70 Z" fill="none" stroke="var(--theme-quest-cyan)" strokeWidth="3" className="pulse" />
    <circle cx="50" cy="50" r="10" fill="var(--theme-quest-cyan)" className="pulse" />
  </svg>
);
export default QuestLoader;