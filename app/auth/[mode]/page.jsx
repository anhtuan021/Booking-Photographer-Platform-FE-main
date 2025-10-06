"use client"
import LoginForm from '../../../src/components/LoginForm'
import RegisterForm from '../../../src/components/RegisterForm'
import React from 'react'

export default function AuthPage({ params }){
  const { mode } = params
  return (
    <div className="account-page">
      <div className="container">
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterForm />}
        {mode !== 'login' && mode !== 'register' && <div className="py-5"><h2>{mode} (not implemented)</h2></div>}
      </div>
    </div>
  )
}
