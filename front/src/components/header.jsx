import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"

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

            <div className="space-x-6 flex">
                <button className="rounded-md pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to={"/home"}>
                        Home
                    </Link>
                </button>

                <button className="rounded-md pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to={"/exploring"}>
                        Explorer
                    </Link>
                </button>

                <button className="rounded-md pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to={"/attacking"}>
                        Attaquer
                    </Link>
                </button>
            </div>

            <button
                onClick={handleDeconexion}
                className="rounded-md bg-indigo-500 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-[16px] text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 active:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Deconnexion
            </button>
        </header>
    )
}

export default Header