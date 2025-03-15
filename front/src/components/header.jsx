import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

const Header = () => {
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
        <header className="flex items-center justify-between p-[24px] bg-gray-950">
            <h1 className="text-white font-bold text-[24px]">CYBER</h1>
            <button
                onClick={handleDeconexion}
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 active:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Deconnexion
            </button>
        </header>
    )
}

export default Header