// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersList from './pages/UsersList'
import UserDetails from './pages/UserDetails'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Show the paginated user list at the root URL */}
        <Route path="/" element={<UsersList />} />

        {/* Optional detail page for viewing a single user by ID */}
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App