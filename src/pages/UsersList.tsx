// src/pages/UsersList.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addUser, deleteUser, fetchUsers, setPage } from '../store/userSlice'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  avatar: string
  name?: string // used for newly added users (via POST)
  job?: string
  createdAt?: string
}

const UsersList: React.FC = () => {
    const dispatch = useAppDispatch()
    const { users, page, totalPages, loading, error } = useAppSelector((state) => state.users)
    
    // Keep these as local state since they're component-specific
    const [name, setName] = useState('')
    const [job, setJob] = useState('')
    const [filter, setFilter] = useState('')
    const [timerInfo, setTimerInfo] = useState({ time: '', total: 0 })
  
    useEffect(() => {
      dispatch(fetchUsers(page))
    }, [page, dispatch])
  
    const handlePrev = () => {
      if (page > 1) dispatch(setPage(page - 1))
    }
  
    const handleNext = () => {
      if (page < totalPages) dispatch(setPage(page + 1))
    }
  
    const handleDelete = (userId: number) => {
      dispatch(deleteUser(userId))
    }
  
    const handleAddUser = async () => {
      try {
        await dispatch(addUser({ name, job })).unwrap()
        setName('')
        setJob('')
      } catch (err) {
        console.error('Add user failed', err)
      }
    }


  const isAddDisabled = !name.trim() || !job.trim()


  useEffect(() => {
    const fetchDelayedUsers = async () => {
      try {
        const res = await axios.get('https://reqres.in/api/users?delay=3')
        const data = res.data
        setTimerInfo({
          time: new Date().toLocaleTimeString(),
          total: data.total,
        })
      } catch (err) {
        console.error('Delayed fetch failed', err)
      }
    }

    // call it immediately, then every 10s
    fetchDelayedUsers()
    const intervalId = setInterval(fetchDelayedUsers, 10_000)
    return () => clearInterval(intervalId)
  }, [])


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  const getDisplayName = (u: User) => {
    if (u.name) return u.name

    return `${u.first_name} ${u.last_name}`.trim()
  }

const filteredUsers = users.filter((user) => {
    const fName = user.first_name.toLowerCase();
    const lName = user.last_name.toLowerCase();
    const filterText = filter.toLowerCase();
  
    return fName.startsWith(filterText) || lName.startsWith(filterText);
  });


  // Render

  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold mb-3">Add New Customer</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job"
            className="border p-2 rounded"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />

          <button
            onClick={handleAddUser}
            disabled={isAddDisabled}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Name (e.g. 'Trac')"
          className="border p-2 rounded w-full"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Users (Page {page})</h1>
      <ul className="space-y-3 mb-4">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="p-4 rounded-md bg-gray-100 flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatar ||
                  'https://avatar.iran.liara.run/public/15'
                }
                alt={getDisplayName(user)}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{getDisplayName(user)}</div>
                <div className="text-gray-600">
                  {user.email || 'No email provided'}
                </div>
                <Link
                  to={`/users/${user.id}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>

            <button
              onClick={() => handleDelete(user.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
        >
          Next
        </button>
      </div>

      <div className="mt-6 text-center">
        {timerInfo.time && (
          <p className="text-sm text-gray-700">
            Last timer fetch at <strong>{timerInfo.time}</strong>. Total users
            reported: <strong>{timerInfo.total}</strong>.
          </p>
        )}
      </div>
    </div>
  )
}

export default UsersList