"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'

const intiForm = {
  email: '',
  password: ''
}
const Home = () => {
  const router = useRouter()
  const [form, setForm] = useState(intiForm)
  const [loading, setLoading] = useState(false)


  const handleLogin = async () => {
    setLoading(true)
    const response = await signIn('credentials', { redirect: false, email: form.email, password: form.password })
    if (response?.ok) {
      setLoading(false)
      router.push('/dashboard')
    } else {
      setLoading(false)
      var message = "Unauthorized"
      if (response?.error !== undefined && response.error !== null) {
        const error = JSON.parse(response.error)
        message = error?.data?.message
      }
      toast.error(message)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!regex.test(form.password)) {
      toast.error('Password must be at least 6 characters long, contain at least one digit, one uppercase character, one lowercase character and one special character [@ # $ % !]')
    } else {
      handleLogin()
    }
  }

  return (
    <div className=' w-screen h-screen flex justify-center items-center'>
      <div className=' w-[500px] bg-sky-500 p-5  rounded-lg'>
        <h1 className=' text-[48px] h-[66px] text-richGold font-dmsSerifDisplay font-medium'>Hello</h1>
        <form className='flex flex-col gap-[24px] mt-[58px]' onSubmit={handleSubmit} autoComplete='off'>
          <input className=' px-3 py-1  outline-none rounded-md' placeholder='Email' type='email' value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="new-email" />
          <div className=' flex flex-col gap-5'>
            <input className=' px-3 py-1  outline-none rounded-md' placeholder='Password' type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="new-password" />
          </div>
          <div className=' flex justify-center mt-8'>
            <button type="submit" className=' bg-sky-300 px-20 py-2 rounded-md' disabled={loading}>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home