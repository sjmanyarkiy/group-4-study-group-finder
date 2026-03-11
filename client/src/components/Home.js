import React from 'react';
import { Link } from 'react-router-dom'

function Home( { user }) {
  return (
    <div>
      { user ? (
        <div>
          <h1>Welcome back, {user.name}</h1>
          <p>
            You are logged in as a <strong>{ user.user_category}</strong>
          </p>
          <p>
            Browse and join study groups, access course content, and connect with
            fellow {user.user_category === "lecturer" ? "students" : "learners"}.
          </p>
          <Link>
            Browse Study Groups → 
          </Link>
        </div>
      ) : (
        <div>
          <h1>Welcome to LetsStudy! </h1>
          <p>
            A platform for students and lecturers to connect, collaborate, and
            learn together. Join study groups, access course content, and track
            your progress.
          </p>
          <div>
            <div>
              <span>🎓</span>
              <p>Join study groups for Python, JavaScript and more</p>
            </div>
            <div>
              <p>Rate and review your learning experience in each group</p>
            </div>
            <div>
              <p>Connect with institutions and fellow students</p>
            </div>
            <div>
              <Link>
                Get Started
              </Link>
              <Link>
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
