import s from './Timer.module.css';
import NavbarIn from '../../Components/NavBarIn/NavBarIn';
import TimerComponent2 from '../../Components/TimerComponent/TimerComponent2';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Timer() {

    const navigate = useNavigate();

    // Runs when function is called initially 
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/olsa/landing-page');
        }
    }, [])

    return(
        <main>  
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Pomodoro Timer</h1>
                </div>

                <div id={s.main_content_container}>
                    <TimerComponent2></TimerComponent2>
                </div>
                
                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>
        </main>
    )
}