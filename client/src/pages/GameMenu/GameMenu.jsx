import React from 'react'
import GameDescription from '../../components/GameDescription/GameDescription'

const GameMenu = () => {
  return (
      <div className='flex flex-col scroll-auto h-screen'>
          <GameDescription />
          <GameDescription />
          <GameDescription />
      </div>
  )
}

export default GameMenu