import React from "react";
import NavbarOut from "../../Components/NavBarOut/NavBarOut";
import s from './LandingPageStyle.module.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import flashcards from '../../Assets/flash-cards.png';
import notes from '../../Assets/notes.png';
import schedule from '../../Assets/schedule.png';
import computer from '../../Assets/computer.png';
import { Link } from "react-router-dom";
import arrow from '../../Assets/arrow2.png'
 
function LandingPage() {
    return (
        <main>  
            <div className={s.background_1}>
                <NavbarOut></NavbarOut>
                
                <div className={s.title_box}>
                    <Card id={s.title_card}>
                        <Card.Body >
                            <Card.Title className={s.title}>Take control of your learning today!</Card.Title>
                            <Card.Text className={s.subtitle}>
                            OLSA uses the latest and greatest in terms of psychological, 
                        biological, and neurophysical findings with aims to become the optimal learning support application for 
                        students of all backgrounds and preferences.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card id={s.arrow_card}>
                        <Card.Img className={s.arrow} variant="top" src={arrow} />
                        <Card.Body>
                            <Button id={s.title_button} as={Link} to="/olsa/create-account" variant="primary">Start now!</Button>
                        </Card.Body>
                    </Card>
                    
                </div>
            
                <div id={s.feature_title}>
                    <h1 >Research-backed features!</h1>
                </div>
            
                <div className={s.grid_container}>
                    <Card id={s.feature1} className={s.grid_item} >
                        <Card.Img className={s.feature_image} variant="top" src={flashcards} />
                        <Card.Body>
                            <Card.Title>Practice testing</Card.Title>
                            <Card.Text>
                                Practice testing, like retrieval practice, strengthens memory and deepens understanding 
                                by actively recalling information, making it a crucial tool for effective learning.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card id={s.feature2} className={s.grid_item} >
                        <Card.Img className={s.feature_image} variant="top" src={schedule} />
                        <Card.Body>
                            <Card.Title>Space-based repetitive learning</Card.Title>
                            <Card.Text>
                                Scheduling dedicated learning times fosters focused engagement, reduces procrastination, 
                                and improves knowledge retention.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card id={s.feature3} className={s.grid_item} >
                        <Card.Img className={s.feature_image} variant="top" src={notes} />
                        <Card.Body>
                            <Card.Title>Scientific note-taking formats</Card.Title>
                            <Card.Text>
                                Choosing the right note-taking format, like the Cornell method, personalizes information organization, 
                                enhances critical thinking, and optimizes learning for different situations.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                <div>   
                    <div id={s.olsa_description_box}>
                        <img id={s.wizzkid} src={computer} alt="A student being very productive on a computer"/>
                        
                        <Card id={s.description}>
                            <Card.Body>
                                <Card.Title id={s.why_olsa}>Why OLSA?</Card.Title>
                                <Card.Text>
                                    OLSA is your ultimate learning companion, combining powerful tools to transform the way you study and 
                                    retain information. Conquer concepts with flashcards (compatible with Quizlet), schedule events and classes to 
                                    stay on track, and organize your knowledge with flexible note-taking formats. Master time management with the 
                                    integrated pomodoro timer, and curate your learning resources by building a personalized library of links - 
                                    all within a single, streamlined platform. Unleash your learning potential and achieve academic success with OLSA!
                                </Card.Text>
                                <span id={s.button_box}>
                                    <Button id={s.get_started_today} as={Link} to="/olsa/create-account" variant="primary">Get started today!</Button>
                                </span>
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
 
export default LandingPage;