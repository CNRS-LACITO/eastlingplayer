import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';

class PlayButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayPlay : document.getElementById('player').paused
    }
  }

  showPlayPause = event => {
      this.setState({
        displayPlay : document.getElementById('player').paused
      });
  }

  componentDidMount(){
    document.getElementById('player').addEventListener('pause', this.showPlayPause);
    document.getElementById('player').addEventListener('playing', this.showPlayPause);
  }

  playPause(){
    
    //si on change de phrase
    if(this.props.id!==window.currentSentence || this.props.isWordList === true){
      document.getElementById('player').currentTime = this.props.start;
    }
    
    if(document.getElementById('player').paused){
      document.getElementById('player').play();
    }else{
      document.getElementById('player').pause();
    }

    this.setState({
      displayPlay : document.getElementById('player').paused
    });
    
  }

  render() {
    return(
    <IconButton color="primary" aria-label="play" onClick={this.playPause.bind(this)} >
      <PlayArrow style={{display:(this.state.displayPlay)?'block':'none'}} />
      <Pause style={{display:(this.state.displayPlay)?'none':'block'}} />
    </IconButton>
    );
  }
}

export default PlayButton;