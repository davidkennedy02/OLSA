import NavbarIn from "../../Components/NavBarIn/NavBarIn";
import DailyOverview from "../../Components/DailyOverview/DailyOverview";
import zigzag from './../../Assets/zigzag.png';
// import { Link } from "react-router-dom";
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LinearProgressBar from "../../Components/LinearProgressBar/LinearProgressBar";
import { Link } from "react-router-dom";
import flashcards from './../../Assets/flash-cards.png';
import notes from './../../Assets/notes.png';
import schedule from './../../Assets/schedule.png';
import hourglass from './../../Assets/hourglass.png';
import database from './../../Assets/database.png';
import s from './HomeStyle.module.css'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Home () {

    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/olsa/landing-page');
        }
    })

    return (
        <main>  
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    {/* <img id={s.zigzag} src={zigzag} alt="Illustrative accents"/> */}
                    <h1 id={s.title}>Hello {localStorage.getItem('user')}</h1>
                    {/* <img id={s.zigzag} src={zigzag} alt="Illustrative accents"/> */}
                </div>

                <div id={s.main_content_container}>
                    <Card id={s.overview_container} className={s.card}>
                        <h1 id={s.overview_title}>Daily Overview</h1>
                        <DailyOverview id={s.daily_overview}></DailyOverview>
                        {/* <div id={s.progress_bar_container}>
                            <LinearProgressBar id={s.progress_bar} variant="determinate" value={75} />
                        </div> */}
                    </Card>

                    <div id={s.features_container}>

                        <Card id={s.card1} className={s.card} as={Link} to="/olsa/flashcards">
                            <Card.Img variant="top" src={flashcards} />
                            <Card.Body>
                                <Card.Title>Flashcards</Card.Title>
                            </Card.Body>
                        </Card>

                        <Card id={s.card2} className={s.card} as={Link} to="/olsa/notes">
                            <Card.Img variant="top" src={notes} />
                            <Card.Body>
                                <Card.Title>Notes</Card.Title>
                            </Card.Body>
                        </Card>

                        <Card id={s.card3} className={s.card} as={Link} to="/olsa/schedule">
                            <Card.Img variant="top" src={schedule} />
                            <Card.Body>
                                <Card.Title>Schedule</Card.Title>
                            </Card.Body>
                        </Card>

                        <Card id={s.card4} className={s.card} as={Link} to="/olsa/repository">
                            <Card.Img variant="top" src={database} />
                            <Card.Body>
                                <Card.Title>Repository</Card.Title>
                            </Card.Body>
                        </Card>

                        <Card id={s.card5} className={s.card} as={Link} to="/olsa/timer">
                            <Card.Img variant="top" src={hourglass} />
                            <Card.Body>
                                <Card.Title>Timer</Card.Title>
                            </Card.Body>
                        </Card>

                    </div>
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

export default Home;

