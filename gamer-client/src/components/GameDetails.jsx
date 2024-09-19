import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const GameDetails = () => {

    const {gameId} = useParams()
    const [game, setGame] = useState({})
    const [categories, setCategories] = useState([])
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()


    const fetchGameById = async () => {
        const response = await fetch(`http://localhost:8000/games/${gameId}`,
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                }
            })
        const gameDetails = await response.json()
        setGame(gameDetails)
    }

    const fetchGameReviews = async () => {
        const response = await fetch(`http://localhost:8000/reviews/?game=${gameId}`,
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                }
            })
        const reviewData = await response.json()
        setReviews(reviewData)
    }
 
    useEffect(() => {
        fetchGameById()
        fetchGameReviews()
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
            {game.created_by === JSON.parse(localStorage.getItem("user_id")) ? (
                <button onClick={() => {
                    navigate(`/games/${gameId}/edit`)
                }}>Edit Game</button>
            ) : ""}
            <button onClick={() => {
                navigate(`/games/${gameId}/review`)
            }}>Review Game</button>

            {reviews ? (
                <>
                    <h3>Reviews:</h3>
                    <ul>
                    {reviews.map(review => {
                        return (
                            <>
                                <li>{review.review}</li>
                            </>
                        )
                    })}
                    </ul>
                </>
            ) : ''}
        </>
    )
}