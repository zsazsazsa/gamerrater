import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const Review = () => {

    const { gameId } = useParams()
    const [game, setGame] = useState({})
    const [reviewText, setReviewText] = useState("")
   
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

    useEffect(() => {
        fetchGameById()
    }, [gameId])

    const handleInputChange = (e) => {
        setReviewText(e.target.value)
    }

    const handleReviewSave = async (e) => {
        e.preventDefault()

        const reviewObj = {
            game: parseInt(gameId),
            review: reviewText
        }

        if (reviewText) {

            return  await fetch("http://localhost:8000/reviews/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                },
                body: JSON.stringify(reviewObj)
            }).then(() => {
                navigate(`/games/${gameId}`)
            })
        } else {
            alert("Please Fill Out All Fields")
        }
        
    }

    return (
        <>
            <h1>Review Form for {game.title} </h1>
            <form>
            <textarea rows="5" cols="40" onChange={handleInputChange}></textarea>
                <div>
                    <button
                    onClick={handleReviewSave}>Save Review</button>
                </div>
            </form>
        </>
    )
    
    
}