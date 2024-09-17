import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Games = ({ games, getGames }) => {

    const navigate = useNavigate()

    useEffect(() => {
        getGames()
    }, [])

    const displayGames = () => {
        if (games && games.length) {
            return games.map(game => <div key={`key-${game.id}`} className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 mt-5 bg-slate-50">
                <div><Link to={`/games/${game.id}`}>{game.title}</Link></div>
            </div>)
        }

        return <h3>Loading Games...</h3>
    }

    return (
        <>
            <div><button
                onClick={() => {
                    navigate("/newgame")
                }}>Register New Game</button></div>
            <h1 className="text-3xl">Games List</h1>
            {displayGames()}
        </>
    )
}
