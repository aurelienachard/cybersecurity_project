import Header from "../components/header"
import { useState } from "react"
import axios from 'axios'

const Attacking = () => {
    const [targetURL, setTargetURL] = useState('')
    const [scanID, setScanID] = useState(null)

    const handleSetTargetURL = (event) => {
        setTargetURL(event.target.value)
    }

    const startScan = (event) => {
        event.preventDefault()

        axios.post(`${import.meta.env.VITE_API_URL}/zap/activescan`, {targetURL}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.data && response.data.status === 'success') {
                setScanID(response.data.scanID)
            } else {
                console.log('Erreur lors du lancement du scan actif')
            }
        })
        .catch(error => {
            console.log('Erreur:', error)
        })
    }

    const downloadHTMLReport = () => {
        window.open(`${import.meta.env.VITE_API_URL}/zap/htmlreport`, '_blank')
    }

    return (
        <div className="bg-gray-900 min-h-screen w-full">
            <Header />

            <div className="p-[24px]">
                <form onSubmit={startScan} className="pt-[24px] w-[640px] mx-auto">
                    <label className="text-white">Rentrez votre URL</label>
                    
                    <input 
                        type="text"
                        value={targetURL}
                        onChange={handleSetTargetURL}
                        className="mt-[10px] block w-full rounded-md bg-white/5 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" 
                        required
                    />

                    <button
                        type="submit"
                        className="mt-[20px] flex w-full justify-center rounded-md bg-indigo-500 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-[16px] font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                        Lancer le scan actif
                    </button>
                </form>
            </div>

            {scanID && (
                <div>
                    <div>
                        <p className="text-white">scan actif demarre</p>

                        <button
                            onClick={downloadHTMLReport}
                            className="rounded-sm bg-green-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px] font-semibold shadow-xs hover:bg-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
                            Télécharger rapport HTML
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Attacking