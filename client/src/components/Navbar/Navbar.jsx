import React from 'react'

const Navbar = () => {
  return (
    <div className=''>
      <nav className="flex">
        <div style={{color:"var(--accent-primary)"}} className='p-2'>Home</div>
        <div style={{color:"var(--accent-primary)"}} className='p-2'>Rooms</div>
        <div style={{color:"var(--accent-primary)"}} className='p-2'>Profile</div>
        <div style={{color:"var(--accent-primary)"}} className='p-2'>Themes</div>
        <div style={{color:"var(--accent-primary)"}} className='p-2'>Leaderboard</div>
      </nav>
    </div>
  )
}

export default Navbar