import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// { create item, auth } decronstructed props passed down from higher component
const PunchClockSection = ({ createPunchClock, auth }) => {
  // will move all the function code to its own context to act as a stand alone app if needed
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clock, setClock] = useState();
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  let date = new Date();
  let currentTime = date.getHours() + ":" + date.getMinutes();
  const handleToggle = (e) => {
    e.preventDefault();
    // if user is not clocked in
    if (!isClockedIn) {
      // set clockedIn to true
      setIsClockedIn(true);
      // add a time log item into the database with relevant clock in details
      createPunchClock({
        name: "Clocked in Record", 
        user: { 
          email: auth.user.email,
          id: auth.user.id,
          name: auth.user.name,
          picture: auth.user.picture,
        },
        date: date,
        time_punched_in: currentTime
      });
      //function to increment the clock based on seconds passed
      setClock(setInterval(() => setTime({
        //ternary logic to set seconds appropriately
        days: time.hours >= 23 ? time.days++ : time.days,
        hours: time.minutes >= 59 ? time.hours++ : time.hours,
        minutes: time.seconds >= 59 ? time.minutes++ : time.minutes,
        //todo --> having problems with seconds, for some reason seconds hits 1 twice which is also
        //todo--> affecting the minute incrementor, so needs to be fixed here.
        seconds: time.seconds > 59 ? time.seconds = 0 : time.seconds++
      }), 1000 ));
    } else {
      //! -- stupid quick fix for now -- 
      // adjust minutes by dividing by 2 before setting
      // because time increments by 2 everytime the minute goes up
      time.minutes = time.minutes / 2;
      // adjust seconds by subtracting seconds by the amount of minutes after --
      // -- dividing by 2 because it adds an extra second every time it tries to
      // correctly increment the minute place... if that makes sense
      time.seconds = time.seconds - time.minutes;
      // add a time log item into the database with relevant clock out details
      createPunchClock({
        name: "Clocked out Record",
        user: { 
          email: auth.user.email,
          id: auth.user.id,
          name: auth.user.name,
          picture: auth.user.picture,
        },
        date: date,
        time_punched_out: currentTime,
        amount_time_clocked: time
      });
      // set clockedIn to false
      setIsClockedIn(false);
      // clear the clock/ interval function
      clearInterval(clock);
      // reset time state
      setTime({
        hours: 0,
        minutes: 0,
        seconds: 0
      });
    }
  };
  const border = {
    border:'2px solid lightGray', 
    width:'350px', 
    height:'auto',
    padding: '5px',
    margin: 'auto'
  };
  return (
    <center>
      <Card>
        <br />
        <Card.Title>Punch Clock</Card.Title>
        <Card.Header style={border}>
          <Card.Subtitle>{time.minutes}:{time.seconds}</Card.Subtitle>
        </Card.Header>
        <Card.Body>

        { !isClockedIn ? 
          <Button id="clock-in-btn" onClick={(e) => handleToggle(e)}>Clock in</Button> :
          <Button id="clock-out-btn" onClick={(e) => handleToggle(e)}>Clock out</Button>
        }
        </Card.Body>
      </Card>
    </center>
  )
}

export default PunchClockSection