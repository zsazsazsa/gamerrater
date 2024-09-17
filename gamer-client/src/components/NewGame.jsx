import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const NewGame = () => {

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const [newGame, setNewGame] = useState({
        title: "",
        description: "", 
        designer: "",
        year_released: 0,
        number_of_players: 0,
        estimated_time: 0,
        age_recommendation: 0,
        categories: []
    })

    const getCategories = async () => {
        const response = await fetch("http://localhost:8000/categories",
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
                }
            })
        const cats = await response.json()
        setCategories(cats)
    }

    useEffect(() => {
        getCategories()
    }, [])

    const handleInputChange = (e) => {
        const gameCopy = {...newGame}
        gameCopy[e.target.name] = (e.target.value)
        setNewGame(gameCopy)
    }

    const handleNumberChange = e => {
        const gameCopy = {...newGame}
        gameCopy[e.target.name] = parseInt(e.target.value)
        setNewGame(gameCopy)
    }

    const handleCategory = (e) => {
        const gameCopy = { ...newGame }
        const selectedCategoryId = parseInt(e.target.value)  // Use category ID
        
        // Only add the category if it's not already in the array
        if (!gameCopy.categories.includes(selectedCategoryId)) {
            gameCopy.categories = [...gameCopy.categories, selectedCategoryId]
        }
    
        setNewGame(gameCopy)
    }
    
    

   const handleSave = async (e) => {
    e.preventDefault()
    if (newGame.title && newGame.description && newGame.designer && newGame.year_released && newGame.number_of_players && newGame.estimated_time && newGame.age_recommendation && newGame.categories.length > 0) {
        return  await fetch("http://localhost:8000/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
            },
            body: JSON.stringify(newGame)
        }).then(() => {
            navigate("/games")
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
                    name="title" />
            </fieldset>
            <fieldset>
                <label>Description:</label>
                <input 
                    type="text"
                    onChange={handleInputChange}
                    name="description" />
            </fieldset>
            <fieldset>
                <label>Designer:</label>
                <input 
                    type="text"
                    onChange={handleInputChange}
                    name="designer" />
            </fieldset>
            <fieldset>
                <label>Year Released:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="year_released" />
            </fieldset>
            <fieldset>
                <label>Number of Players:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="number_of_players" />
            </fieldset>
            <fieldset>
                <label>Estimated Playtime:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="estimated_time" />
            </fieldset>
            <fieldset>
                <label>Age Recommendation:</label>
                <input 
                    type="number"
                    onChange={handleNumberChange}
                    name="age_recommendation" />
            </fieldset>
            <fieldset>
                <label>Category:</label>
                <select onChange={handleCategory}>
                    <option disabled selected>-</option>
                        {categories.map(category => {
                        return (
                            <>
                            <option 
                                key={category.id}
                                value={category.id}>{category.title}</option>
                            </>
                        )
                    })}
                </select>
            </fieldset>
            <button onClick={handleSave}>Save</button>
        </div>
    </>
}