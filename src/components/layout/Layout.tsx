import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from './MainNav'

const Layout = () => {
  return (
    <div className=" w-full">
      <MainNav />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout