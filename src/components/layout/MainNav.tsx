import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { CheckSquare, Users, Settings, LogOut, BarChart2, Terminal, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MainNav = () => {
  const location = useLocation()
  const { currentUser, signOut, isAdmin } = useAuth()

  const navigation = [
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Summaries', href: '/summaries', icon: BarChart2 },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl bg-black/[0.2]"
    >
      <div className="flex h-14 items-center px-3 md:px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/" className="flex items-center mr-2 md:mr-4">
            <img 
              src="/icon_512x512_transparent.png" 
              alt="Content Currency AI"
              className="h-8 w-8"
            />
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center justify-center">
          <motion.div 
            className="flex space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {navigation.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors",
                      isActive 
                        ? "text-white bg-white/10" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </nav>

        {/* Profile Menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-sm ring-1 ring-white/10" />
                <Avatar className="h-full w-full relative z-10">
                  <AvatarImage 
                    src={currentUser?.photoURL || undefined} 
                    alt={currentUser?.displayName || 'User'} 
                  />
                  <AvatarFallback className="bg-white/5 text-gray-300 text-xs md:text-sm">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-black/80 backdrop-blur-xl border-white/10 shadow-xl shadow-black/20"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-white">{currentUser?.displayName}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link 
                  to="/messages" 
                  className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  <span>Logs</span>
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/admin" 
                      className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default MainNav