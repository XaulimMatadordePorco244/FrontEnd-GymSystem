import { Outlet } from 'react-router-dom'
import Navbar from './NavBar.tsx'

export default function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}