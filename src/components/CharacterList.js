import React, { useState, useEffect } from 'react';
import { Container, InputGroup, Card, Form, Button, Col, Row, Modal } from 'react-bootstrap';
import './CharacterList.css';
import ButtonConfirm from './ButtonConfirm';
import SurvivalData from '../data/survivalData.json'

let nextId = 0;

export default function CharacterList() {
  const initialList = [];  
  const [CharacterList, setCharacterList] = useState(initialList);
  const [showModal, setShowModal] = useState(false)
  const [showEatingModal, setShowEatingModal] = useState(false)
  const [showDrinkingModal, setShowDrinkingModal] = useState(false)
  const [showSleepingModal, setShowSleepingModal] = useState(false)
  const [eatingTarget,setEatingTarget] = useState(0);
  const [drinkingTarget,setDrinkingTarget] = useState(0);
  const [sleepingTarget,setSleepingTarget] = useState(0);
  const [sleepingLength,setSleepingLength] = useState(0);
  const [coldWeather, setColdWeather] = useState(0);
  const [hotWeather, setHotWeather] = useState(0);
  const [totalHours, setTotalHours] = useState(0); // Track total time elapsed
  const [hoursToPass, setHoursToPass] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const resetHunger = (index) => {
    let tempCharacters = [...CharacterList];
    tempCharacters[index].hunger = 0;
    tempCharacters[index].reset_hunger = totalHours;
    setCharacterList(tempCharacters);
  }

  const resetThirst = (index) => {
    let tempCharacters = [...CharacterList];
    tempCharacters[index].thirst = 0;
    tempCharacters[index].reset_thirst = totalHours;
    setCharacterList(tempCharacters);
  }

  const resetSleep = (index) => {
    let tempCharacters = [...CharacterList];
    tempCharacters[index].sleep = 0;
    tempCharacters[index].reset_sleep = totalHours;
    setCharacterList(tempCharacters);
  }

  const handleDrinkDrink = (event) => {
    let drinkWhat = event.target.value;
    let thirstIncrease = 0;
    switch(drinkWhat){
      
      case "dirtyWater":
        thirstIncrease = 1;
      break;

      case "cleanWater":
        thirstIncrease = 2;
      break;
     
      default:
      break;

    }

    let tempCharacters = [...CharacterList];

    if(tempCharacters[drinkingTarget].thirst - thirstIncrease < 0){
      tempCharacters[drinkingTarget].thirst = 0;
      tempCharacters[drinkingTarget].reset_thirst = totalHours;
    }else{
      tempCharacters[drinkingTarget].thirst -= thirstIncrease;
      tempCharacters[drinkingTarget].reset_thirst = (totalHours-SurvivalData.thirst.track[tempCharacters[drinkingTarget].thirst]);
    }
    
    setCharacterList(tempCharacters);
    setShowDrinkingModal(false);
  }


  const handleEatFood = (event) => {
    let eatWhat = event.target.value;
    let hungerIncrease = 0;
    let thirstIncrease = 0;
    switch(eatWhat){
      
      case "food":
        hungerIncrease = 1;
      break;

      case "preparedFood":
        hungerIncrease = 2;
      break;
      case "soup":
        hungerIncrease = 1;
        thirstIncrease = 1;
      break;
      case "preparedSoup":
        hungerIncrease = 2;
        thirstIncrease = 1;
      break;

      default:
      break;

    }

    let tempCharacters = [...CharacterList];
    if(tempCharacters[eatingTarget].hunger - hungerIncrease < 0){
      tempCharacters[eatingTarget].hunger = 0;
      tempCharacters[eatingTarget].reset_hunger = totalHours;
    }else{
      tempCharacters[eatingTarget].hunger -= hungerIncrease;
      tempCharacters[eatingTarget].reset_hunger = (totalHours-SurvivalData.hunger.track[tempCharacters[eatingTarget].hunger]);
    }

    if(tempCharacters[eatingTarget].thirst - thirstIncrease < 0){
      tempCharacters[eatingTarget].thirst = 0;
      tempCharacters[eatingTarget].reset_thirst = totalHours;
    }else{
      tempCharacters[eatingTarget].thirst -= thirstIncrease;
      tempCharacters[eatingTarget].reset_thirst = (totalHours-SurvivalData.thirst.track[tempCharacters[eatingTarget].thirst]);
    }
    
    setCharacterList(tempCharacters);
    setShowEatingModal(false);
  }

  const handleSleep = (event) => {
    let tempCharacters = [...CharacterList];
    let sleepIncrease = 0;
    switch(sleepingLength){

      case "1":
        sleepIncrease=1
      break;

      case "6":
        sleepIncrease=3
      break;

      case "8":
        sleepIncrease=3
        alert(tempCharacters[sleepingTarget].name+" is Well Rested");
      break;

      default:
        break;
    }
    tempCharacters[sleepingTarget].sleep -= sleepIncrease;
    if(tempCharacters[sleepingTarget].sleep < 0){
      tempCharacters[sleepingTarget].sleep = 0;
    }
    tempCharacters[sleepingTarget].reset_sleep = (totalHours-SurvivalData.sleep.track[tempCharacters[sleepingTarget].sleep]);
    if(tempCharacters[sleepingTarget].reset_sleep < 0){
      tempCharacters[sleepingTarget].reset_sleep = 0;
    }
    setCharacterList(tempCharacters);
    setShowSleepingModal(false);
  }

  const handleChangeTime = (event) => {
    setHoursToPass(parseInt(event.target.value));
  };

  const passTime = () => {
    setTotalHours((prevHours) => parseInt(prevHours)+hoursToPass);
  }

  //Modifiers for Update Character Status

  const handleCheckHotWeather = (event) => {
    setHotWeather(prev => (prev === 1 ? 0 : 1)); // toggle between 1 and 0
  }

  const handleCheckColdWeather = (event) => {
    setColdWeather(prev => (prev === 1 ? 0 : 1)); // toggle between 1 and 0
  }

 // Function to update each character's status
 const updateCharacterStatus = () => {
  setCharacterList((prevCharacters) =>
    prevCharacters.map((char) => {
      //const StartingLevels = {"hunger":char.hunger,"thirst":char.thirst,"sleep":char.sleep};
      const updateLevel = (level, track, name) => {
        let hoursPassed = totalHours - char['reset_'+name];
        let newLevel = level;
        let fatigue = char.fatigue ?? 0;
      
        // Iterate through levels until we either run out of hours or reach the last level
        if(track === 'hunger' && coldWeather === 1){
          hoursPassed += hoursPassed;
        }
        if(track === 'thirst' && hotWeather === 1){
          hoursPassed += hoursPassed;
        }

        for (let i = level; i < track.length; i++) {
          if (hoursPassed >= track[i]) {
            hoursPassed -= track[i];
            newLevel = i + 1;
          } else {
            break;
          }
        }
      
        // If we've reached or surpassed the final level
        if (newLevel >= track.length) {
          newLevel = track.length - 1; // Stay at the last level
        }

        return { newLevel, fatigue };
      };

      const hungerUpdate = updateLevel(char.hunger, SurvivalData.hunger.track, 'hunger');
      const thirstUpdate = updateLevel(char.thirst, SurvivalData.thirst.track, 'thirst');
      const sleepUpdate =  updateLevel(char.sleep,  SurvivalData.sleep.track,  'sleep' );

      return {
        ...char,
        hunger: hungerUpdate.newLevel,
        thirst: thirstUpdate.newLevel,
        sleep: sleepUpdate.newLevel,
        fatigue: 0
      };
    })
  );
};

  // useEffect to update character status whenever totalHours changes
  useEffect(() => {
    updateCharacterStatus();
  }, [totalHours]);

  //Modal Controls

  const handleModalClose = () => {
    setShowModal(false);
  }

  const handleModalOpen = () => {
    setShowModal(true);
  }

  const handleEatingModalOpen = (index) => {
    setShowEatingModal(true);
    setEatingTarget(index)
  }

  const handleEatingModalClose = () => {
    setShowEatingModal(false);
  }

  const handleDrinkingModalOpen = (index) => {
    setShowDrinkingModal(true);
    setDrinkingTarget(index)
  }

  const handleDrinkingModalClose = () => {
    setShowDrinkingModal(false);
  }


  const handleSleepingModalOpen = (index) => {
    setShowSleepingModal(true);
    setSleepingTarget(index);
  }
  
  const handleSleepingModalClose = () => {
    setShowSleepingModal(false);
  }
  
  const handleSaveProject = (event) => {
    let systemJSON =JSON.stringify(CharacterList);
    const blob = new Blob([systemJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FalloutCharacterList.json';
    link.click();
  
    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
    fathom.trackEvent('Saved Characters for Fallout Status Tracker'); // eslint-disable-line
  }

  const handleLoadProject = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const fileData = e.target.result;
        let inits = JSON.parse(fileData);
        setCharacterList(inits);
        nextId = inits.length;
        setShowModal(false);
        fathom.trackEvent('Loaded Characters for Fallout'); // eslint-disable-line
    }    
    reader.readAsText(file); 
  }

  const onConfirmDel = (type, param, id) =>
  {
      if(type === 'yes') {
        setCharacterList(CharacterList.filter((a) => a.id !== id));
      }
  }

  const renderCharacterList = () => {
    let originalList = CharacterList.slice();
    let finalList = [];

    originalList.sort(function (a, b) {
      return b.name - a.name;
    });

    finalList =[...originalList];
    return finalList;

  }

  const capitalize = (str) =>{
    return str.charAt(0).toUpperCase()+ str.slice(1);
  }

  const toggleHeader = () => {
    setIsVisible(!isVisible);
  }

  return (
    <>
      <h1>Fallout Character Status Tracker</h1>
      <Container>
        {isVisible && (
          <Row className='border p-2' id="header" key="CharacterRow">          
              <Button className='saveButton m-1' onClick={handleSaveProject}>Save Order</Button>              
              <Button className='loadButton m-1' onClick={handleModalOpen}  >Load Order</Button>
              <br></br>
              <h1>Characters:</h1>
              <hr />
              <InputGroup className="mb-2">
                <Form.Control id="newName" />
                <Button
                  onClick={() => {
                    let name = document.getElementById('newName').value;
                    setCharacterList([
                      ...CharacterList,
                      {"id": nextId++, "name": name, "fatigue":0,  "hunger":0, "thirst":0, "sleep":0, "reset_hunger":0, "reset_thirst":0, "reset_sleep":0, "dysentery":false  }
                    ]);
                  }}
                >
                  Add
                </Button>
              </InputGroup>
              {CharacterList.map((actor) => (
                <Card style={{ width: '15rem', margin: '2px auto' }} key={actor.id} data-id={actor.id}>
                  <Card.Body>
                    <Card.Title>{actor.name}</Card.Title>
                    <Card.Text>
                     <ButtonConfirm onConfirm={onConfirmDel} targetID={actor.id}  title="Delete" query="Are you sure...?"  />
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </Row>
        )}
        { /* Upload JSON Character List Modal  */ }
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Upload Character List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="file" accept=".json" onChange={handleLoadProject} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleModalClose}>
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>

        { /* Eating Modal  */ }
        <Modal show={showEatingModal} onHide={handleEatingModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eat What?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <button onClick={handleEatFood} className="btn btn-success btn-margin" value="food" >Eat Food</button>
                <button onClick={handleEatFood} className="btn btn-success btn-margin" value="preparedFood" >Eat Prepared Food</button><br></br>
                <button onClick={handleEatFood} className="btn btn-success btn-margin" value="soup" >Eat Soup</button>
                <button onClick={handleEatFood} className="btn btn-success btn-margin" value="preparedSoup" >Eat Prepared Soup</button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleEatingModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        { /* Drinking Modal  */ }
        <Modal show={showDrinkingModal} onHide={handleDrinkingModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Drink What?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <button onClick={handleDrinkDrink} className="btn btn-success btn-margin" value="dirtyWater" >Drink Dirty Water</button>
                <button onClick={handleDrinkDrink} className="btn btn-success btn-margin" value="cleanWater" >Drink Clean Water</button><br></br>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleDrinkingModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        { /* Sleeping Modal  */ }
        <Modal show={showSleepingModal} onHide={handleSleepingModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sleep For How Long?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <select 
                className="form-select" 
                onChange={e => setSleepingLength(e.target.value)} 
                value={sleepingLength}>
                  {[1,6,8].map(function(time){
                    return (<option value={time}>{time} Hour(s)</option>)
                  })}
                </select>
                <button className='btn btn-success' onClick={handleSleep}>Sleep</button>
              </InputGroup>
                
                
                <br></br>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleSleepingModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
            <Row key="AdvancementRow" className='gx-5'>
            <Col md={12}>
              <button className='btn btn-info' onClick={toggleHeader}>
                {isVisible ? 'Hide Header' : 'Show Header'}
              </button>
              <h2>Advancement Time</h2>
            </Col>
              <Col className='md=6'>
                <InputGroup className="mb-3">
                <InputGroup.Text>Time To Pass</InputGroup.Text>
                  <select className="form-select" onChange={handleChangeTime}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,48,72,96,120,144].map(function(time){
                        return (<option value={time}>{time} Hours</option>)
                      })}
                    </select>
                </InputGroup>
                <button className="btn btn-primary" onClick={passTime}>Pass Time</button>
              </Col>
              <Col className='md=6'>
                <InputGroup className="mb-3">
                  <InputGroup.Text>Hot Weather</InputGroup.Text>
                  <InputGroup.Checkbox aria-label="Hot Weather"  checked={hotWeather === 1} onChange={handleCheckHotWeather}/>
                </InputGroup>
             
                <InputGroup className="mb-3">
                  <InputGroup.Text>Cold Weather</InputGroup.Text>
                  <InputGroup.Checkbox aria-label="Cold Weather"checked={coldWeather === 1}  onChange={handleCheckColdWeather}/>
                </InputGroup>
              </Col>
              
              <Col md={12}>
              <hr></hr>
              <h2>Character Statuses - Total Time Passed: ({totalHours})</h2>
              {renderCharacterList(CharacterList).map((character, index) =>{ 
                return(
                <Card key={index}>
                  <Card.Body >
                    <Card.Title style={{"textAlign": "left"}}>{character.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Character Status</Card.Subtitle>
                    <Row key="ButtonRow">
                      <Col style={{"textAlign":"left"}}> Fatigue: Coming Soon<br></br>
                        {/* <InputGroup className="mb-3">
                          <InputGroup.Text>Dysentery</InputGroup.Text>
                          <InputGroup.Checkbox aria-label="Dysentery" />
                        </InputGroup> */}
                      </Col>
                      <Col>Hunger: {capitalize(SurvivalData.hunger.names[character.hunger])} () <br></br>
                        <button className="btn btn-success" onClick={ () => { handleEatingModalOpen(index)} }>Eat</button>
                        <button className="btn btn-danger" style={{"marginLeft":"10px"}} onClick={ () => { resetHunger(index)} }>Reset Hunger</button>
                      </Col>
                      <Col>Thirst: <span >{capitalize(SurvivalData.thirst.names[character.thirst])}</span><br></br>
                        <button className="btn btn-success"  onClick={ () => { handleDrinkingModalOpen(index)} }>Drink</button>
                        <button className="btn btn-danger" style={{"marginLeft":"10px"}} onClick={ () => { resetThirst(index)} }>Reset Thirst</button>
                      </Col>
                      <Col>Sleep: <span >{capitalize(SurvivalData.sleep.names[character.sleep])}</span><br></br>
                        <button className="btn btn-success" onClick={() => { handleSleepingModalOpen(index)} }>Sleep</button>
                        <button className="btn btn-danger" style={{"marginLeft":"10px"}} onClick={ () => { resetSleep(index)} }>Reset Sleep</button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )})}
            </Col>
        </Row>
      </Container>
    </>
  );
}