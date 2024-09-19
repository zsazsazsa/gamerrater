import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const EditGame = () => {

    const {gameId} = useParams()
    const [game, setGame] = useState({ categories: [] });
    const [categories, setCategories] = useState([])
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

    const getCategories = async () => {
        const response = await fetch("http://localhost:8000/categories",
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                }
            })
        const cats = await response.json()
        setCategories(cats)
    }

    useEffect(() => {
        fetchGameById()
        getCategories()
    }, [gameId])

    const handleInputChange = (e) => {
        const gameCopy = {...game}
        gameCopy[e.target.name] = (e.target.value)
        setGame(gameCopy)
    }

    const handleNumberChange = e => {
        const gameCopy = {...game}
        gameCopy[e.target.name] = parseInt(e.target.value)
        setGame(gameCopy)
    }

    const handleCategory = (e) => {
        const gameCopy = { ...game }
        const selectedCategoryId = JSON.parse(e.target.value)  // Use category ID
        
        // Only add the category if it's not already in the array
        if (!gameCopy.categories.includes(selectedCategoryId)) {
            gameCopy.categories = [...gameCopy.categories, selectedCategoryId]
        }
    
        setGame(gameCopy)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (game.title && game.description && game.designer && game.year_released && game.number_of_players && game.estimated_time && game.age_recommendation && game.categories.length > 0) {
            return  await fetch(`http://localhost:8000/games/${gameId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token"))}`
                },
                body: JSON.stringify(game)
            }).then(() => {
                navigate(`/games/${gameId}`)
            })
        } else {
            alert("Please Fill Out All Fields")
        }
    }

    return <>
        <div>
            <fieldset>
                <label>Title:</label>
                <input 
                    type="text"
                    onChange={handleInputChange}
                    name="title"
                    value={game.title} />
            </fieldset>
            <fieldset>
                <label>Description:</label>
                <input 
                    type="text"
                    onChange={handleInputChange}
                    name="description" 
                    value={game.description}/>
            </fieldset>
            <fieldset>
                <label>Designer:</label>
                <input 
                    type="text"
                    onChange={handleInputChange}
                    name="designer" 
                    value={game.designer}/>
            </fieldset>
            <fieldset>
                <label>Year Released:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="year_released"
                    value={game.year_released} />
            </fieldset>
            <fieldset>
                <label>Number of Players:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="number_of_players"
                    value={game.number_of_players} />
            </fieldset>
            <fieldset>
                <label>Estimated Playtime:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="estimated_time"
                    value={game.estimated_time} />
            </fieldset>
            <fieldset>
                <label>Age Recommendation:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="age_recommendation"
                    value={game.age_recommendation} />
            </fieldset>
            <fieldset>
                <label>Category:</label>
                <select multiple onChange={handleCategory} value={game.categories[0]?.id || ""}>
                    <option disabled>-</option>
                        {categories.map(category => {
                        return (
                            <>
                            <option 
                                key={category.id}
                                value={JSON.stringify(category)}>{category.title}</option>
                            </>
                        )
                    })}
                </select>
            </fieldset>
            <button onClick={handleSave}>Save</button>
        </div>
    </>
}