import { Link } from "react-router-dom"

import Header from "../components/header"

const Home = () => {
    return (
        <div className="bg-gray-900 min-h-screen w-full">
            <Header />

            <div className="flex justify-center m-[24px]">
                <div className="rounded-lg bg-gray-800 shadow-sm m-[24px] w-[500px]">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-[18px] font-bold text-gray-200">Explorer l'application</h2>
                        
                        <p className="text-[16px] text-gray-400 mt-[10px] mb-[10px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Duis sit amet aliquam purus. Maecenas faucibus elit lectus.
                        vel condimentum erat scelerisque pharetra.</p>

                        <button
                            type="button"
                            className="rounded-md bg-indigo-500 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-[16px] text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            <Link to={"/exploring"}>
                                Clique ici
                            </Link>
                        </button>
                    </div>
                </div>

                <div className="rounded-lg bg-gray-800 shadow-sm m-[24px] w-[500px]">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-[18px] font-bold text-gray-200">Trouver les failles de sécurité</h2>
                        
                        <p className="text-[16px] text-gray-400 mt-[10px] mb-[10px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Duis sit amet aliquam purus. Maecenas faucibus elit lectus.
                        vel condimentum erat scelerisque pharetra.</p>

                        <button
                            type="button"
                            className="rounded-md bg-indigo-500 pt-[12px] pl-[16px] pb-[12px] pr-[16px] text-[16px]text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            <Link to={"/attacking"}>
                                Clique ici
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home