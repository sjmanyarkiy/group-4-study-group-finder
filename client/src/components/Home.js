import React from 'react'

function Home( { user }) {
  return (
    <div>
      { user ? (
        <h2>Welcome back, {user.name}</h2>
      ) : (
        <h2>Welcome to StudyGroups</h2>
      )}
    </div>
  )
}

export default Home
