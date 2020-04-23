import React, { Component } from 'react'
import './App.css'
import 'font-awesome/css/font-awesome.min.css';



//const audio = <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />


export default class App extends Component {
  constructor() {
    super()
    this.loop = undefined
  }
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
  }

  componentWillUnmount() {
    clearInterval(this.loop)
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;
    
    if(isPlaying) {
      clearInterval(this.loop);
      
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });

      this.loop = setInterval(() => {
        const { 
          clockCount, 
          currentTimer, 
          breakCount, 
          sessionCount 
        } = this.state;
        
        if(clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
          });
          
          //audio.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
        
      }, 1000);
    }
  }

  handleReset = () => {
    this.setState( {
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false,
    })
  }

  convertToTime = (count) => {
    let minute = Math.floor(count / 60)
    let second = count % 60
    let minutes = minute < 10 ? ('0' + minute) : minute
    let seconds = second < 10 ? ('0' + second) : second
    return `${minutes}:${seconds}`
  }

  handleLengthChange = (count, timerType) => {
    const {sessionCount, breakCount, isPlaying, currentTimer} = this.state

    let newCount
    
    if(timerType === 'session') {
      newCount = sessionCount + count
    } else {
      newCount = breakCount + count
    }
    if(newCount > 0 && newCount < 61 && !isPlaying) {
      this.setState({
        [`${timerType}Count`]: newCount
      });
      
      if(currentTimer.toLowerCase() === timerType) {
        this.setState({
          clockCount: newCount * 60
        })
      }
    }
  }

  render() {
    const breakProps = {
      title: 'Break',
      count: this.state.breakCount,
      handleDecrease: () => this.handleLengthChange(-1, 'break'),
      handleIncrease: () => this.handleLengthChange(1, 'break')
    }
    const sessionProps = {
      title: 'Session',
      count: this.state.sessionCount,
      handleDecrease: () => this.handleLengthChange(-1, 'session'),
      handleIncrease: () => this.handleLengthChange(1, 'session'),
    }
    return (
      <div>
        <div className="flex">
          <SetTimer {...breakProps}/>
          <SetTimer {...sessionProps}/>
        </div>
        <div className="clock-container">
          <h1 id="timer-label">{this.state.currentTimer}</h1>
          <span id="time-left">{this.convertToTime(this.state.clockCount)}</span>
          <div className="flex">
            <button id="start_stop" onClick={this.handlePlayPause}>
              <i className={`fa fa-${this.state.isPlaying ? 'pause' : 'play'}`}></i>
            </button>
            <span>{this.count}</span>
            <button id="reset" onClick={this.handleReset}>
              <i className="fa fa-sync">Reset</i>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const SetTimer = (props) => {
  const id = props.title.toLowerCase()
  return(
    <div className="timer-container">
      <h2 id={`${id}-label`}>{props.title} Length</h2>
      <div className="flex actions-wrapper">
        <button id={`${id}-decrement`} onClick={props.handleDecrease}><i className="fa fa-minus"></i></button>
        <span id={`${id}-length`}>{props.count}</span>
        <button id={`${id}-increment`} onClick={props.handleIncrease}><i className="fa fa-plus"></i></button>
      </div>
    </div>
  )
}
