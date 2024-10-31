import { useState } from 'react';
import { Container, InputGroup, Card, Form, Button, Col, Row, Modal } from 'react-bootstrap';
import './CharacterList.css';
import ButtonConfirm from './ButtonConfirm';
let nextId = 0;

export default function CharacterList() {
  const initialList = [];
  const [CharacterList, setCharacterList] = useState(initialList);
  const [showModal, setShowModal] = useState(false)
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); // State to track the selected card

  const handleCardClick = (index) => { // Function to handle card click
      setSelectedCardIndex(index); // Update the selected card index
  };

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



  return (
    <>
      <nav className="pv3 ph3 ph4-ns" role="navigation" style={{"background":"black"}}>
        <div className="flex-l justify-between items-center center">
          <a href="/" className="f3 fw2 hover-white no-underline white-90 dib">NullSheen Game Tools</a>
        </div>
      </nav>

      <h1>Fallout Character Status Tracker</h1>
      <Container>
        <Row>
          <Col>
          
            <Button className='saveButton' onClick={handleSaveProject}>Save Order</Button>              
            <Button className='loadButton' onClick={handleModalOpen}  >Load Order</Button>
            <br></br>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload initive List</Modal.Title>
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
              <Card style={{ width: '21rem', margin: '2px auto' }} key={actor.id} >
                <Card.Body>
                  <Card.Title>
                    {actor.name}: <input value={actor.initiative} style={{width:'100px'}} data-key={actor.id} type="number" />  
                    <ButtonConfirm onConfirm={onConfirmDel} targetID={actor.id}  title="Delete" query="Are you sure...?"  />
                  </Card.Title>
                  
                  
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col>
            <div>
              <h2>Character Statuses</h2>
              {renderCharacterList(CharacterList).map((character, index) =>{  
                const cardStyles = selectedCardIndex === index ? 
                { width: '18rem', margin: '2px auto', backgroundColor: 'rgb(0, 169, 256)', cursor: 'pointer' } : // Highlighted style
                { width: '18rem', margin: '2px auto', cursor: 'pointer' }; // Default style
                return(
                <Card style={cardStyles} key={index} onClick={() => handleCardClick(index)}>
                  <Card.Body >
                    <Card.Title>{character.name}</Card.Title>
                  </Card.Body>
                </Card>
              )})}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}