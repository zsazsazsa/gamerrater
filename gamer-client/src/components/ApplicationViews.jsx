
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { Register } from '../pages/Register.jsx'
import { Authorized } from "./Authorized.jsx"



export const ApplicationViews = () => {


    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    </BrowserRouter>
}