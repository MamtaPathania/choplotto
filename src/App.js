
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import SubDateTime from './pages/Subscriber/SubDateTime'
import { useContext } from 'react'
import { ThemeContext } from './components/ThemeContext'
import Login from './pages/Login'
import Unsubscription from './pages/Unsubscription'
import Search from './pages/Subscriber/Search'
import ContestByDate from './pages/ContestDetail/ContestByDate'
import ContestByTicket from './pages/ContestDetail/ContestByTicket'
import SubscriptionStatus from './pages/Subscriber/SubscriptionStatus'
import SubMsisdn from './pages/Subscriber/SubMsisdn'
import Revenue from './pages/Revenue/Revenue'
import GetCount from './pages/GetCount/GetCount'

function App() {
    const { theme } = useContext(ThemeContext);
    
    return (
        <div className={`${theme === 'dark' ? 'bg-black shadow-black text-white' : 'bg-white'}`}>
            <BrowserRouter>
        
                  
        <Routes>
            
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/subscription/status' element={<SubscriptionStatus/>} />
            <Route path='/subscription/subdatetime' element={<SubDateTime/>} />
            <Route path='/subscription/msisdn' element={<SubMsisdn/>}/>
            <Route path='/contest' element={<ContestByDate/>}/>
            <Route path='/contest/ticket' element={<ContestByTicket/>}/>
            <Route path='/unsub' element={<Unsubscription/>}/>
            <Route path='/revenue' element={<Revenue/>}/>
            <Route path='/getcount' element={<GetCount/>}/>


          
        </Routes>

</BrowserRouter>
        </div>
        

        
        
    )
}

export default App
