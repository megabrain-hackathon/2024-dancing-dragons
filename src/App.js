import React from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// dragons
import Toothless from './dragons/toothless.gif';
import LightFury from './dragons/light-fury.gif';
import AngryToothless from './dragons/angry-toothless.gif';
import BabyToothless from './dragons/baby-toothless.gif';
import ListeningToothless from './dragons/listening-toothless.gif';
import Toothless2 from './dragons/toothless2.gif';
import MouseToothless from './dragons/mouse-toothless.gif';
import SpeedyToothless from './dragons/speedy-toothless.gif';

import BackgroundMusic from './music/background.mp3';
import {Stack} from "react-bootstrap";

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      textWidth: null,
      textHeight: null,
      dragons: [],
      tabIndex: 1,
      background: {
        width: 760,
        height: 600,
        color: 'white',
        image: null,
        mode: 1, // 1: color, 2: image
      },
      handlingDragon: null,
      backgroundMusic: BackgroundMusic,
        ciIndex:1,
      }
    }
  
  
  render() {
    const {dragons, background, backgroundMusic } = this.state;
    const editPanel = this.getEditPanel(this.state.tabIndex);
    return (
      <Container className='App' style={{width: '100%'}}>
        {dragons.length > 0 && <audio src={backgroundMusic} controls autoPlay loop hidden/>
        }
        <Row style={{width: '100%'}}>
          <Col style={{ width:'50%', backgroundColor: 'white'}}>
            <div id='background' style={{
              width: `${background.width}px`,
              height: `${background.height}px`,
              backgroundColor: background.mode === 1 ? background.color : null,
              backgroundImage: background.mode === 2 ? background.image : null,
              }}
                 onDragOver={(e) => {
                    e.preventDefault();
                 }}
                onDrop={(e) => {
                  e.preventDefault();
                  console.log(e);
                  
                  const {handlingDragon} = this.state;
                  console.log('dragon:',handlingDragon.target.src)
                  const { pageX, pageY } = e;
                  const { x, y } = e.target.getBoundingClientRect();
                  const width = 100;
                  const height = 100;
                  const newDragon = {
                    src: handlingDragon.target.src,
                    name: handlingDragon.target.alt,
                    height: height,
                    width: width,
                    x: pageX - x - width/2,
                    y: pageY - y - height/2,
                    degree: 0,
                    zIndex: this.state.dragons.length+1,
                  }
                  this.setState({
                    dragons: [...dragons, newDragon],
                    handlingDragon: null,
                  })
                }}
            >
              {
                dragons.map((dragon, index) => {
                  return (
                    <img src={dragon.src} alt={dragon.name} style={{
                      height: dragon.height,
                      width: dragon.width,
                      transform: `rotate(${dragon.degree}deg)`,
                      position: 'absolute',
                      top: dragon.y,
                      left: dragon.x,
                      zIndex: index,
                    }}/>
                  )
                }, this)
              }
            </div>
            
          </Col>
          <Col style={{ width: '400px', backgroundColor: 'yellow'}}>
            <Button onClick={() =>  this.setState({tabIndex: 1,background:{...this.state.background,ciIndex:1} })}>배경</Button>
            <Button onClick={() => this.setState({tabIndex: 2})}>드래곤</Button>
            <Button onClick={() => this.setState({tabIndex: 3})}>Music</Button>
            <Button onClick={() => this.setState({tabIndex: 4})}>저장</Button>
            {editPanel}
          </Col>
        </Row>
      </Container>
    );
  }
  
  getEditPanel(id) {
    console.log(id);
    switch (id) {
      case 1:
        const {ciIndex} = this.state.background;
        
        let backgroundContent;
        if (ciIndex === 1) {
          backgroundContent = (
            <Form.Control
              type="color"
              id="exampleColorInput"
              defaultValue="#FFFFFF"
              title="Choose your color"
              size="lg"
              onChange={(e) => this.setState({background: {...this.state.background, color: e.target.value}})}
            />
          )
        } else if(ciIndex ===2 ) {
          backgroundContent= (
            <input type="file" className="real-upload" accept="image/*" required multiple>
              
              </input>
          )
        }
        
        return (
          <div>
            {/* <Form.Control size="lg" type="text" placeholder="가로" onChange={(e) => this.setState({background: {...this.state.background,width:e.target.value > 760 ? 760 : e.target.value}})}/> */}
            <Form.Control size="lg" type="text" placeholder="가로" value={this.state.textWidth} onChange={(e) => this.setState({textWidth: e.target.value})}/>


            {/* <Form.Control size="lg" type="text" placeholder="세로" onChange={(e) => this.setState({background: {...this.state.background,height:e.target.value > 600 ? 600 : e.target.value}})}/> */}
            <Form.Control size="lg" type="text" placeholder="세로" value={this.state.textHeight} onChange={(e) => this.setState({textHeight: e.target.value})}/>
            <div style={{position:'relative',top:10}}>
            <Button style={{width:'100px',position: 'absolute', right: 0}}onClick={()=>{
              const { textWidth, textHeight, dragons } = this.state;
    
              const newDragons = dragons.filter((dragon) => {
                const x = dragon.x;
                const y = dragon.y;
                const endX = this.state.textWidth > 600 ? 600 : this.state.textWidth;
                const endY = this.state.textHeight > 750 ? 750 : this.state.textHeight;
          
                if (x >= 80 && x + dragon.width <= endX+100 && y >= 0 && y + dragon.height <= endY) {
                  return true; 
                }
                return false;
              });

              this.setState({
                dragons: newDragons,
                background: {...this.state.background,width:this.state.textWidth > 600 ? 600 : this.state.textWidth,
                  height:this.state.textHeight > 750 ? 750 : this.state.textHeight},
                textWidth: this.state.textWidth > 600 ? 600 : this.state.textWidth,
                textHeight: this.state.textHeight > 750 ? 750 : this.state.textHeight,
              })
            }}>확인</Button>
            </div><br/><br/>


            <Form.Check inline name='background' type='radio' defaultChecked={true} onClick={() =>this.setState({background:{...this.state.background,ciIndex:1}})} />


            <Form.Check inline name='background' type='radio' onClick={() =>this.setState({background:{...this.state.background,ciIndex:2}})}/>
            {backgroundContent}
          </div>
        )
      case 2:
        return (
          <Stack direction='horizontal' className='dragon-list-box'>
            <img src={Toothless} alt={'toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={LightFury} alt={'light-fury'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={AngryToothless} alt={'angry-toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={BabyToothless} alt={'baby-toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={ListeningToothless} alt={'listening-toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={Toothless2} alt={'toothless2'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={MouseToothless} alt={'mouse-toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
            <img src={SpeedyToothless} alt={'speedy-toothless'} onDragStart={(e) => {this.setState({handlingDragon: e})}}/>
          </Stack>
        )
      case 3:
        return (
          <div>
            <p>Music</p>
            <input
              type='file'
              accept='audio/*'
              name='audio_file'
              onChange={(e) => {
                const selectedAudio = e.target.files[0];
                
                if (selectedAudio) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const previewAudioUrl = reader.result;
                    console.log(previewAudioUrl);
                    this.setState({ backgroundMusic: previewAudioUrl });
                  };
                  
                  reader.readAsDataURL(selectedAudio);
                }
              }}
            />
          </div>
        )
      case 4:
        return (
          <div>
            다운로드
          </div>
        )
      default:
        console.assert(false, '올바르지 않은 모드입니다.');
    }
  }
}
