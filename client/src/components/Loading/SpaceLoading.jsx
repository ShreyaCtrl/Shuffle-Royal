// // // const SpaceLoader = () => (
// // //   <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
// // //     <style>{`
// // //       .orbit { animation: orbit 3s linear infinite; transform-origin: center; }
// // //       @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// // //     `}</style>
// // //     <circle cx="50" cy="50" r="5" fill="var(--theme-space-light)" />
// // //     <circle cx="50" cy="50" r="35" fill="none" stroke="var(--theme-space-midnight)" strokeWidth="1" strokeDasharray="4 4" />
// // //     <g className="orbit">
// // //       <text x="75" y="55" fontSize="12" fill="var(--theme-space-pastel-blue)">♠</text>
// // //       <text x="15" y="55" fontSize="12" fill="var(--theme-space-pastel-blue)">♥</text>
// // //     </g>
// // //   </svg>
// // // );

// // // export default SpaceLoader;

// // const SpaceLoader = () => (
// //   <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
// //     <style>{`
// //       .orbit {
// //         animation: orbit 4s linear infinite;
// //         transform-origin: center;
// //       }
// //       @keyframes orbit {
// //         from { transform: rotate(0deg); }
// //         to { transform: rotate(360deg); }
// //       }
// //       .suit {
// //         font-family: serif;
// //         font-size: 14px;
// //         text-anchor: middle;
// //         dominant-baseline: middle;
// //       }
// //     `}</style>
    
// //     {/* Central Star */}
// //     <circle cx="50" cy="50" r="5" fill="var(--theme-space-light)" />
    
// //     {/* Orbital Path */}
// //     <circle cx="50" cy="50" r="35" fill="none" stroke="var(--theme-space-midnight)" strokeWidth="1" strokeDasharray="4 4" />
    
// //     {/* Orbiting Group */}
// //     <g className="orbit">
// //       {/* North: Spades */}
// //       <text x="50" y="15" className="suit" fill="var(--theme-space-pastel-blue)">♠</text>
      
// //       {/* South: Clubs */}
// //       <text x="50" y="85" className="suit" fill="var(--theme-space-pastel-blue)">♣</text>
      
// //       {/* East: Hearts */}
// //       <text x="85" y="50" className="suit" fill="var(--theme-space-pastel-blue)">♥</text>
      
// //       {/* West: Diamonds */}
// //       <text x="15" y="50" className="suit" fill="var(--theme-space-pastel-blue)">♦</text>
// //     </g>
// //   </svg>
// // );

// // export default SpaceLoader;
// const SpaceLoader = () => (
//   <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//     <defs>
//       {/* Radial Gradient for the center Star */}
//       <radialGradient id="starGradient">
//         <stop offset="0%" stopColor="var(--theme-space-light)" />
//         <stop offset="70%" stopColor="var(--theme-space-pastel-blue)" />
//         <stop offset="100%" stopColor="var(--theme-space-navy)" stopOpacity="0" />
//       </radialGradient>

//       {/* Glow Filter for the Suits */}
//       <filter id="glow">
//         <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
//         <feMerge>
//           <feMergeNode in="coloredBlur" />
//           <feMergeNode in="SourceGraphic" />
//         </feMerge>
//       </filter>
//     </defs>

//     <style>{`
//       .orbit {
//         animation: orbit 5s linear infinite;
//         transform-origin: center;
//       }
//       @keyframes orbit {
//         from { transform: rotate(0deg); }
//         to { transform: rotate(360deg); }
//       }
//       .suit {
//         font-family: serif;
//         font-size: 30px;
//         text-anchor: middle;
//         dominant-baseline: middle;
//         filter: url(#glow);
//       }
//       .star {
//         animation: pulse 2s ease-in-out infinite;
//       }
//       @keyframes pulse {
//         0%, 100% { r: 6; opacity: 0.8; }
//         50% { r: 8; opacity: 1; }
//       }
//     `}</style>
    
//     {/* Pulsing Center Star with Gradient */}
//     <circle cx="50" cy="50" r="8" fill="url(#starGradient)" className="star" />
    
//     {/* Orbital Path */}
//     <circle cx="50" cy="50" r="35" fill="none" stroke="var(--theme-space-midnight)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
    
//     {/* Orbiting Group */}
//     <g className="orbit">
//       {/* North: Spades (Deep Blue/Black) */}
//       <text x="50" y="150" className="suit" fill="#1a1a1a">♠</text>
      
//       {/* South: Clubs (Deep Blue/Black) */}
//       <text x="50" y="85" className="suit" fill="#1a1a1a">♣</text>
      
//       {/* East: Hearts (Vibrant Red) */}
//       <text x="85" y="50" className="suit" fill="#ff5252">♥</text>
      
//       {/* West: Diamonds (Vibrant Red) */}
//       <text x="15" y="50" className="suit" fill="#ff5252">♦</text>
//     </g>
//   </svg>
// );

// export default SpaceLoader;

const SpaceLoader = () => (
  <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Radial Gradient for the center Star */}
      <radialGradient id="starGradient">
        <stop offset="0%" stopColor="var(--theme-space-light)" />
        <stop offset="70%" stopColor="var(--theme-space-pastel-blue)" />
        <stop offset="100%" stopColor="var(--theme-space-navy)" stopOpacity="0" />
      </radialGradient>

      {/* Stronger Glow Filter for larger icons */}
      <filter id="glowLarge">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <style>{`
      .orbit { 
        animation: orbit 6s linear infinite; 
        transform-origin: center; 
      }
      @keyframes orbit { 
        from { transform: rotate(0deg); } 
        to { transform: rotate(360deg); } 
      }
      .suit {
        font-family: serif;
        font-size: 22px; /* Increased size */
        text-anchor: middle;
        dominant-baseline: middle;
        filter: url(#glowLarge);
      }
      .star {
        animation: pulse 2.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { r: 6; opacity: 0.7; }
        50% { r: 10; opacity: 1; }
      }
    `}</style>
    
    {/* Pulsing Center Star */}
    <circle cx="50" cy="50" r="10" fill="url(#starGradient)" className="star" />
    
    {/* Subtle Orbital Ring */}
    <circle cx="50" cy="50" r="36" fill="none" stroke="var(--theme-space-midnight)" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
    
    <g className="orbit">
      {/* North: Spades */}
      <text x="50" y="14" className="suit" fill="#1a1a1a">♠</text>
      
      {/* South: Clubs */}
      <text x="50" y="86" className="suit" fill="#1a1a1a">♣</text>
      
      {/* East: Hearts */}
      <text x="86" y="50" className="suit" fill="#ff5252">♥</text>
      
      {/* West: Diamonds */}
      <text x="14" y="50" className="suit" fill="#ff5252">♦</text>
    </g>
  </svg>
);

export default SpaceLoader;