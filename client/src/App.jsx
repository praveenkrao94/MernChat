import React, { useContext } from 'react'
import Register from './register/Register'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import Routess from './Routess'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Bot from './Chat/Bot'



function App() {

  axios.defaults.baseURL = "http://localhost:4040"
  axios.defaults.withCredentials = true

  

  return (
   <UserContextProvider>
<Routess/>
<BrowserRouter>

<Routes>

  <Route path='/bot' element={<Bot/>} />

</Routes>

</BrowserRouter>
   </UserContextProvider>
     
    
  )
}

export default App