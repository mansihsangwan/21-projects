import React from 'react'
import Filter from './components/Filter'
import Cart from './components/Cart'
import MenuList from './components/MenuList'

const App = () => {
  return (
    <main className='container m-5'>
      <header>
          <h1 className='text-success'> Campus Eats</h1>
      </header>
      <Filter />
      <MenuList />
      <Cart />
    </main>
  )
}

export default App