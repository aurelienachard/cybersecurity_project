import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

const Tool = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setUser(true)
        }
    }, [])

    const handleDeconexion = () => {
        localStorage.removeItem('token')
        setUser(false)
        navigate('/')
    }

    return (
        <div className="bg-gray-900 min-h-screen w-full">
            <h1 className="text-white">You're connected</h1>
            <button onClick={handleDeconexion} className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Deconnexion</button>
        </div>
    )
}

export default Tool