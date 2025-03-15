import { useState } from "react"
import Header from "../components/header"
import axios from 'axios'

const Tool = () => {
    const [targetURL, setTargetURL] = useState('')
    const [scanID, setScanID] = useState(null)
    const [scanStatus, setScanStatus] = useState(null)

    const handleSetTargetURL = (event) => {
        setTargetURL(event.target.value)
    }

    const startScan = (event) => {
        event.preventDefault()
        
        const token = localStorage.getItem('token')

        axios.post(`${import.meta.env.VITE_API_URL}/zap/spider`, {targetURL}, {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`  // Ajoutez cette ligne
            }
        })
        .then(response => {
            if (response.data && response.data.status === 'success') {
                setScanID(response.data.scanID)
                setScanStatus('running')
            } else {
                console.log('Erreur lors du lancement du scan')
            }
        })
        .catch(error => {
            console.log('Erreur:', error)
        })
    }

    const stopScan = () => {
        if (!scanID) return;

        const token = localStorage.getItem('token')
        
        axios.get(`${import.meta.env.VITE_API_URL}/zap/spider/stop/${scanID}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data && response.data.status === 'succes') {
                setScanStatus('stopped')
                console.log('Scan arrete avec succes')
            } else {
                console.log('Erreur lors de l\'arrêt du scan')
            }
        })
        .catch(error => {
            console.log('erreur:', error)
        })
    }

    const pauseScan = () => {
        if (!scanID) return;

        const token = localStorage.getItem('token')

        axios.get(`${import.meta.env.VITE_API_URL}/zap/spider/pause/${scanID}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data && response.data.status === 'succes') {
                setScanStatus('pause')
                console.log('Scan mise en pause avec succes')
            } else {
                console.log('Erreur lors de la mise en pause du scan')
            }
        })
        .catch(error => {
            console.log('erreur:', error)
        })
    }

    const relancerScan = () => {
        if (!scanID) return;

        const token = localStorage.getItem('token')

        axios.get(`${import.meta.env.VITE_API_URL}/zap/spider/resume/${scanID}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data && response.data.status === 'succes') {
                setScanStatus('resume')
                console.log('Scan repris avec succes')
            } else {
                console.log('Erreur lors de la reprise du scan')
            }
        })
        .catch(error => {
            console.log('erreur:', error)
        })
    }

    return (
        <div className="bg-gray-900 min-h-screen w-full">
            <Header />
            <div className="p-[24px]">
                <h2 className="text-white font-bold text-[24px] text-center">Analysons votre site web</h2>

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
                    Envoyer
                    </button>
                </form>
            </div>

            {scanID && (
                <div className="bg-white p-[24px] mt-[24px]">
                    <p>Scan démarré avec succès! ID du scan {scanID}</p>
                    <p>Statut: {scanStatus === 'stopped' ? 'Arrêté' : 'En cours'}</p>

                    <button onClick={stopScan} className="bg-red-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px]">Arreter le scan</button>
                    <button onClick={pauseScan} className="bg-orange-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px]">Mettre en pause le scan</button>
                    <button onClick={relancerScan} className="bg-green-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px]">Mettre en pause le scan</button>
                </div>
            )}
        </div>
    )
}

export default Tool