import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// { create item, auth } decronstructed props passed down from higher component
const PunchClockSection = ({ createPunchClock, auth }) => {

  // will move all the function code to its own context to act as a stand alone app if needed
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [intervalSession, setIntervalSession] = useState(null);
  const [clock, setClock] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [time, setTime] = useState({
    seconds: 0,
    time: new Date().toLocaleString(),
    date: new Date()
  });
  
  function calculateTimeWorked( seconds ) {
    if ( seconds > 60 ) {
      let minutes = ( seconds / 60 ).round();
      setClock({ days: clock.days, hours: clock.hours, minutes: minutes });
      if ( minutes > 60 ) {
        let hours = ( minutes / 60 ).round();
        setClock({ days: clock.days, hours: hours, minutes: clock.minutes });
        if ( hours > 24 ) {
          let days = ( hours / 24 ).round();
          setClock({ days: days, hours: clock.hours, minutes: clock.minutes });
        }
      }
    }
    return clock;
  }

  function tick() {
    const t = new Date().toLocaleString().split(", ");
    setTime({ 
      seconds: time.seconds++,
      time: t[1], 
      date: t[0]
    })
  }

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
        date: time.date,
        time: time.time
      });
      //set interval function - start ticking
      const intervalId = setInterval(() => tick(), 1000);
      setIntervalSession( intervalId );
    } else {
      const clock = calculateTimeWorked( time.seconds );
      createPunchClock({
        name: "Clocked out Record",
        user: { 
          email: auth.user.email,
          id: auth.user.id,
          name: auth.user.name,
          picture: auth.user.picture,
        },
        date: time.date,
        time: time.time,
        amount_time_clocked: clock
      });
      // set clockedIn to false
      setIsClockedIn(false);
      // clear the clock/ interval function
      clearInterval( intervalSession );
      // reset time state
      setTime({
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
          <Card.Subtitle>
            {!isClockedIn ? "0:00" : 
              time.seconds > 60 ? time.seconds :
              "0:" + time.seconds
            }
          </Card.Subtitle>
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