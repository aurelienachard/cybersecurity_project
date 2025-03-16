import { useState } from "react"
import Header from "../components/header"
import axios from 'axios'

const Exploring = () => {
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
                <div>
                    {scanStatus === 'stopped' ? (
                        <div className="bg-emerald-800 p-[24px] mt-[24px] w-[640px] mx-auto rounded-lg shadow-md outline-1 -outline-offset-1 outline-white/10 px-4 py-5 sm:p-6">
                            <p className="text-white text-[18px] font-bold">Le scan a été arrêté avec succès.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-[24px] mt-[24px] w-[640px] mx-auto rounded-lg shadow-md outline-1 -outline-offset-1 outline-white/10 px-4 py-5 sm:p-6">
                            <p className="text-white font-bold text-[18px] mb-[10px]">Scan démarré avec succès! {scanID}</p>
                            <p className="text-white">Statut :
                                {
                                    scanStatus === 'stopped' ? ' Arrêté' : 
                                    scanStatus === 'pause' ? ' Pause' :
                                    scanStatus === 'resume' ? ' En cours' : ' En cours'
                                }
                            </p>
                            
                            <div className="flex flex-col gap-[16px] mt-[16px]">
                                <button
                                    onClick={stopScan}
                                    className="rounded-sm bg-red-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px] font-semibold shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
                                    Arrêter le scan
                                </button>
                                
                                <button
                                    onClick={pauseScan}
                                    className="rounded-sm bg-orange-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px] font-semibold shadow-xs hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                                    Mettre en pause le scan
                                </button>
                                
                                <button
                                    onClick={relancerScan}
                                    className="rounded-sm bg-emerald-500 text-white pt-[12px] pl-[16px] pb-[12px] pr-[16px] font-semibold shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                                    Redémarrer le scan
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )}

export default Exploring