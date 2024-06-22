import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import playImage from './../../Assets/play-button.png';
import pauseImage from './../../Assets/pause.png';
import restartImage from './../../Assets/restart.png';
import skipImage from './../../Assets/right.png';
import Stepper from '@mui/material/Stepper';
import MobileStepper from '@mui/material/MobileStepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import s from './TimerComponent.module.css';
import { toBoolean, toDate, toInt } from 'validator';

// Defining the state flow
const STATE_FLOW = ['Focus', 'Short break', 'Focus', 'Short break', 'Focus', 'Long break'];

// Defining the time flow
const TIME_FLOW = [25 * 60, 5 * 60, 25 * 60, 5 * 60, 25 * 60, 15 * 60];


export default function TimerComponent2() {

    const [index, setIndex] = useState(0);
    const [time, setTime] = useState(undefined);
    const [running, setRunning] = useState(false);
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {

        if (!initialised) {

            // Gather variables from local storage
            const remainingSecs = localStorage.getItem('remainingSecs');
            const savedDateTime = localStorage.getItem('savedDateTime');
            const timeIndex = localStorage.getItem('timeIndex');
            const localRunning = localStorage.getItem('running');
            const currentTime = new Date();

            // Set the current time index
            if (timeIndex !== null) {
                setIndex(toInt(timeIndex));
            } else {
                localStorage.setItem('timeIndex', index);
            }

            // Set the running state 
            if (localRunning !== null && toBoolean(localRunning)) {
                setRunning(true);
            } else {
                setRunning(false);
            }

            if (savedDateTime !== null && remainingSecs !== null) {
                
                if (localRunning !== null && toBoolean(localRunning)) {
                    
                    // Calculate time elapsed
                    const timeElapsed = currentTime.getSeconds() - toDate(savedDateTime).getSeconds();

                    // Factor the time to include the time elapsed
                    currentTime.setSeconds(currentTime.getSeconds() + toInt(remainingSecs) - Math.abs(timeElapsed));

                    // Update the local storage to reflect this
                    localStorage.setItem('remainingSecs', toInt(remainingSecs) - Math.abs(timeElapsed));
                }
                else {
                    
                    currentTime.setSeconds(currentTime.getSeconds() + toInt(remainingSecs));
                }
            }
            else {
                currentTime.setSeconds(currentTime.getSeconds() + TIME_FLOW[index]);
                localStorage.setItem('remainingSecs', TIME_FLOW[index]);
            }

            setTime(currentTime);

            // Update the savedDT
            localStorage.setItem('savedDateTime', new Date());

            // Stop unneccesary re-runs 
            setInitialised(true);
        }

    }, [])


    // A function which increments the state of the timer 
    const handleSetState = () => {

        // Update the time shown on the timer 
        const currentTime = new Date();

        // If the currentFlowIndex has reached the last element, set it to zero again
        if ((index) === (STATE_FLOW.length - 1)) {
            setIndex(0);
            currentTime.setSeconds(currentTime.getSeconds() + TIME_FLOW[0])

            localStorage.setItem('remainingSecs', TIME_FLOW[0]);
            localStorage.setItem('timeIndex', 0);
        } else {
            setIndex(index + 1);
            currentTime.setSeconds(currentTime.getSeconds() + TIME_FLOW[index + 1])
            localStorage.setItem('remainingSecs', TIME_FLOW[index + 1])
            localStorage.setItem('timeIndex', index + 1);
        }

        localStorage.setItem('savedDateTime', new Date());
        setTime(currentTime);
    };

    const resetTime = () => {

        const currentTime = new Date();
        currentTime.setSeconds(currentTime.getSeconds() + TIME_FLOW[index]);
        localStorage.setItem('remainingSecs', TIME_FLOW[index]);
        localStorage.setItem('savedDateTime', new Date());
        localStorage.setItem('running', false);

        setTime(currentTime);
        setRunning(false);
    }

    // const handleLocalStorage = () => {}


    function MyTimer({ expiryTimestamp, timerLength, running }) {

        var {
            totalSeconds,
            isRunning,
            start,
            pause,
            resume,
        } = useTimer({ expiryTimestamp, autoStart: running, onExpire: () => console.warn('Timer complete!') });


        const formatTime = (timeInSeconds) => {
            const minutes = Math.floor(timeInSeconds / 60)
                .toString()
                .padStart(2, '0');
            const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        const handlePausePlay = () => {
            if (isRunning) {
                pause();
                localStorage.setItem('running', false);
                setRunning(false);
            } else {
                const now = new Date();
                const remainingSecs = toInt(localStorage.getItem('remainingSecs'));
                now.setSeconds(now.getSeconds() + remainingSecs);

                // Update savedDT
                localStorage.setItem('savedDateTime', new Date());
                localStorage.setItem('running', true);
                setTime(now);
                setRunning(true);
                totalSeconds < timerLength ? resume() : start();
            }
        }

        useEffect(() => {
            
            const remainingSecs = localStorage.getItem('remainingSecs');
            if (remainingSecs !== null && isRunning && totalSeconds < toInt(remainingSecs)) {
                localStorage.setItem('remainingSecs', remainingSecs - 1);
                localStorage.setItem('savedDateTime', new Date());
            }

        }, [totalSeconds]);

        return (
            <Card id={s.timer_container} border='primary' style={{ textAlign: 'center' }}>

                <div id={s.stepper_container}>
                    <Stepper
                        id={s.stepper}
                        activeStep={index}
                        sx={{ flexShrink: 1 }}>
                        {STATE_FLOW.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={`${label}_${index}`} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>

                    <MobileStepper
                        id={s.mobile_stepper}
                        variant="dots"
                        steps={STATE_FLOW.length}
                        position="static"
                        activeStep={index}
                        sx={{ maxWidth: 400, flexGrow: 1 }}
                    />
                </div>

                <div id={s.timer_numbers_container}>
                    <h1 id={s.timer_numbers}>{formatTime(totalSeconds)}</h1>
                </div>

                <div id={s.timer_buttons}>
                    <Button
                        variant='light'
                        onClick={resetTime}
                    >
                        <img src={restartImage} alt='Reset button' />
                    </Button>

                    <Button
                        variant='outline-light'
                        onClick={() => {
                            handlePausePlay();
                        }}>
                        <img src={(isRunning) ? pauseImage : playImage} alt='Start / stop timer button' />
                    </Button>

                    <Button
                        variant='outline-light'
                        onClick={handleSetState}>
                        <img src={skipImage} alt='Skip forward button' />
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <MyTimer expiryTimestamp={time} timerLength={TIME_FLOW[index]} running={running} />
    );
}