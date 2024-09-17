import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const GameDetails = () => {

    const {gameId} = useParams()
    const [game, setGame] = useState({})
    const [categories, setCategories] = useState([])


    const fetchGameById = async () => {
        const response = await fetch(`http://localhost:8000/games/${gameId}`,
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
                }
            })
        const gameDetails = await response.json()
        setGame(gameDetails)
    }

    useEffect(() => {
        fetchGameById()
    }, [gameId])

    useEffect(() => {
        setCategories(game.categories || [])
    }, [game])

    return (
        <>
            <h1>Game Details:</h1>
            <div><h2>{game.title}</h2></div>
            <div>Designed by: {game.designer}</div>
            <div>Released: {game.year_released}</div>
            <div>Number of players: {game.number_of_players}</div>
            <div>Time to play: {game.estimated_time}</div>
            <div>Age recommendation: {game.age_recommendation}</div>
            <div>Categories:</div>
            <ul>
                {categories.map(category => {
                    return <li key={category.id}>{category.title}</li>
                })}
            </ul>
        </>
    )
}