import { useState, useEffect } from 'react';
import { Container, InputGroup, Card, Form, Button, Col, Row, Modal } from 'react-bootstrap';
import './CharacterList.css';
import ButtonConfirm from './ButtonConfirm';
import SurvivalData from '../data/survivalData.json'
console.log(SurvivalData);
let nextId = 0;

export default function CharacterList() {
  const initialList = [
                      {"name":"Dean","fatigue":0,"hunger":0,"thirst":0,"sleep":0},
                      {"name":"Jon","fatigue":0,"hunger":0,"thirst":0,"sleep":0},
                      {"name":"Adam","fatigue":0,"hunger":0,"thirst":0,"sleep":0},
                      {"name":"Marty","fatigue":0,"hunger":0,"thirst":0,"sleep":0}
                    ];
  const [CharacterList, setCharacterList] = useState(initialList);
  const [showModal, setShowModal] = useState(false)
  const [timeToPass, setTimeToPass] = useState(null);
  const [timeState, setTimeState]= useState([]);
  const handleChangeTime = (selectedOption) => {
    setTimeToPass(selectedOption);
  };

  const passTime = () => {
    const updateTime = [...timeState]; 
    updateTime.push(timeToPass);
    setTimeState(updateTime); 
  }

  useEffect(() => {
    timeState.forEach(function (time) {
    
    });
  });

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const  handleSaveProject = (event) => {
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
    fathom.trackEvent('Saved Characters for Fallout '+Edition); // eslint-disable-line
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

  };

  const capitalize = (str) =>{
    return str.charAt(0).toUpperCase()+ str.slice(1);
  }

  const [isVisible, setIsVisible] = useState(true);

  const toggleHeader = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <h1>Fallout Character Status Tracker</h1>
      <Container>
        {isVisible && (
          <Row className='border p-2' id="header">          
              <Button className='saveButton m-1' onClick={handleSaveProject}>Save Order</Button>              
              <Button className='loadButton m-1' onClick={handleModalOpen}  >Load Order</Button>
              <br></br>
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
              <h1>Characters:</h1>
              
              
              <hr />
              <InputGroup className="mb-2">
                <Form.Control id="newName" />
                <Button
                  onClick={() => {
                    let name = document.getElementById('newName').value;
                    setCharacterList([
                      ...CharacterList,
                      {"id": nextId++, "name": name, }
                    ]);
                  }}
                >
                  Add
                </Button>
              </InputGroup>
              {CharacterList.map((actor) => (
                <Card style={{ width: '15rem', margin: '2px auto' }} key={actor.id} >
                  <Card.Body>
                    <Card.Title>{actor.name}</Card.Title>
                    <Card.Text>
                      <input value={actor.fatigue} style={{width:'100px'}} data-key={actor.id} type="number" />  
                      <br></br>
                      <ButtonConfirm onConfirm={onConfirmDel} targetID={actor.id}  title="Delete" query="Are you sure...?"  />
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </Row>
        )}
            <Row>
            <div>
              <button className='btn btn-info' onClick={toggleHeader}>
                {isVisible ? 'Hide Header' : 'Show Header'}
              </button>
              <h2>Advancements</h2>
              <div>
                <label>Time To Pass
                  <select class="form-select" onChange={handleChangeTime}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,48,72,96,120,144].map(function(time){
                      return (<option value={time}>{time} Hours</option>)
                    })}
                  </select>
                  <button className="btn btn-primary" onClick={passTime}>Pass Time</button>
                </label>
              </div>
              <hr></hr>
              <h2>Character Statuses</h2>
              {renderCharacterList(CharacterList).map((character, index) =>{ 
                return(
                <Card key={index}>
                  <Card.Body >
                    <Card.Title style={{"text-align": "left"}}>{character.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Character Status</Card.Subtitle>
                    <Row>
                      <Col>Fatigue:{character.fatigue}</Col>
                      <Col>Hunger:{capitalize(SurvivalData.hunger.names[character.hunger])}</Col>
                      <Col>Thirst:{capitalize(SurvivalData.thirst.names[character.thirst])}</Col>
                      <Col>Sleep:{capitalize(SurvivalData.sleep.names[character.sleep])}</Col>
                    </Row>
                  </Card.Body>
                </Card>
              )})}
            </div>
        </Row>
      </Container>
    </>
  );
}