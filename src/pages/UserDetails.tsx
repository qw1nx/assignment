import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  avatar: string
}

const UserDetails: React.FC = () => {
  const { id } = useParams() // from /users/:id
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`https://reqres.in/api/users/${id}`)
        const data = response.data
        setUser(data.data)
      } catch (err: any) {
        setError('Failed to fetch user details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUser()
    }
  }, [id])

  if (loading) return <p className="text-center">Loading user...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!user) return <p className="text-center">No user found.</p>

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="mx-auto w-24 h-24 rounded-full mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">
        {user.first_name} {user.last_name}
      </h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
}

export default UserDetails