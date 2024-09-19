
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { Register } from '../pages/Register.jsx'
import { Authorized } from "./Authorized.jsx"
import { Games } from "./Games.jsx"
import { useState } from "react"
import { GameDetails } from "./GameDetails.jsx"
import { NewGame } from "./NewGame.jsx"
import { Review } from "./Review.jsx"
import { EditGame } from "./EditGame.jsx"



export const ApplicationViews = () => {

    const [games, setGames] = useState([])

    const getGames = async () => {
        const response = await fetch("http://localhost:8000/games",
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                }
            })
        const games = await response.json()
        setGames(games)
    }

    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
                <Route path="/games">
                    <Route index element={<Games getGames={getGames} games={games} />} />
                    <Route path=":gameId" element={<GameDetails />} />
                    <Route path=":gameId/review" element={<Review />} />
                    <Route path=":gameId/edit" element={<EditGame />} />
                </Route>
                <Route path="/newgame" element={<NewGame />} />
            </Route>
        </Routes>
    </BrowserRouter>
}