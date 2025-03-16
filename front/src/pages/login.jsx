import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from 'react'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = {
            username,
            password
        }

        axios.post(import.meta.env.VITE_API_URL + '/authentication', data, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then((response) => {
            localStorage.setItem('token', response.data.token)
            navigate('/home')
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="flex min-h-screen w-full flex-1 flex-col py-[48px] justify-center bg-gray-900 sm:px-[24px] lg:px-[32px]">
                <form onSubmit={handleSubmit} className="mt-[42px] sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="flex flex-col">
                        <label className="text-white text-[16px] font-medium">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={handleUsername} 
                            className="mt-[10px] block w-full rounded-md bg-white/5 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" 
                            required
                        />
                    </div>

                    <div className="flex flex-col mt-[20px]">
                        <label className="text-white text-[16px] font-medium">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={handlePassword}
                            className="mt-[10px] block w-full rounded-md bg-white/5 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-[20px] flex w-full justify-center rounded-md bg-indigo-500 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-[16px] font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    Login
                    </button>
                </form>
        </div>
    )
}

export default Login