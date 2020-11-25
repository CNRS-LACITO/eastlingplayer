import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Popover, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class Word extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      anchorEl: null,
          open: false
	    };
	}

  playSentence(){
    document.getElementById('player').currentTime = this.props.w.AUDIO.start;
    document.getElementById('player').play();
  }

  pauseSentence(){
    document.getElementById('player').pause();
  }

    componentDidMount() {
      if(this.props.w.AUDIO != undefined){
        const s = document.createElement('script'); 
        s.type = 'text/javascript';
        s.async = true;

        var scriptStr = "wordidList.push('"+this.props.w.id+"');";
        scriptStr += "startTimeList.push("+this.props.w.AUDIO.start+");"
        scriptStr += "endTimeList.push("+this.props.w.AUDIO.end+");"


        s.innerHTML = scriptStr;

        this.instance.appendChild(s);
      }
      
    }

  handleClick = (event) => {
    //console.log(event.currentTarget);
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });

    if(event.currentTarget.id.length>0){
      document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
      document.querySelector('[wordid="'+event.currentTarget.id+'"]').style.border='solid';
    }
      };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    });
    document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
  };

  render() {

    const buttonStyle = {
      'text-transform': 'lowercase'
    }

  	let word = "";
    const transcriptions = [];
  	const translations = [];
    const notes = [];


    //cas où une seule balise FORM est trouvé=>converti en objet et pas en tableau
    //<div style={{display:'table-cell'}}>

    if(this.props.w.TRANSL != undefined && this.props.w.TRANSL !== null){
	    if(this.props.w.TRANSL.length == undefined){
        var isGlossIncluded = this.props.displayOptions.glosses.includes(this.props.w.TRANSL["xml:lang"]);
        var thisClassName = (this.props.isWordList === true)?'wordlistWord':'word';

	      translations.push(
	              <Typography variant="body2" component={this.props.isWordList ===true ? 'div':'p'} style={!isGlossIncluded?{display:'none'}:{visibility:'inherit'}} className={`gloss ${thisClassName} ${this.props.w.TRANSL['xml:lang']}`}>
	                {this.props.w.TRANSL.text}
	              </Typography>
	            );
	    }else{
	      this.props.w.TRANSL.forEach((t) => {
            var isGlossIncluded = this.props.displayOptions.glosses.includes(t["xml:lang"]);
            var thisClassName = (this.props.isWordList === true)?'wordlistWord':'word';

	          translations.push(
	              <Typography variant="body2" component={this.props.isWordList ===true ? 'div':'p'} style={!isGlossIncluded?{display:'none'}:{visibility:'inherit'}}  className={`gloss ${thisClassName} ${t['xml:lang']}`}>
	                {t.text}
	              </Typography>
	            );
	        });
	    }
    }
    
  //
  if(this.props.w.FORM !== undefined && this.props.w.FORM !== null){
      if(this.props.w.FORM.length == undefined){
        transcriptions.push(
                  <Typography variant="body2" component="p">
                    {this.props.w.FORM.text}
                  </Typography>
                );
                word = this.props.w.FORM.text;
        }else{
          this.props.w.FORM.forEach((f) => {
              transcriptions.push(
                  <Typography variant="body2" component="p">
                    {f.text}
                  </Typography>
                );
            });
            word = this.props.w.FORM[0].text;
        }
  }
        // Get note(s) of the sentence
  if(this.props.w.NOTE != undefined && this.props.w.NOTE != null){
    if(this.props.w.NOTE.length == undefined){
      notes.push(
              <Typography variant="body2" component="p" className={`note ${this.props.w.NOTE['xml:lang']}`}>
                {this.props.w.NOTE.message} {this.props.w.NOTE.text}
              </Typography>
            );
    }else{
      this.props.w.NOTE.forEach((f) => {
          notes.push(
              <Typography variant="body2" component="p" className={`note ${f['xml:lang']}`}>
                {f.message} {f.text}
              </Typography>
            );
        });
    }
  }

    return (
      <div id={this.props.w.id} class={this.props.isMorph===true ? "MORPHEME" : "WORD" } style={this.props.isWordList===true ? {} : {display:"inline-block"} } ref={el => (this.instance = el)} >
      { 
            this.props.isWordList===true
            ?
            <div style={{display:'table'}} >
              <div style={{display:'table-cell'}}>
                W{this.props.wID} 
              </div>

              <div style={{display:'table-cell'}} id={this.props.w.id} hidden={!this.props.displayOptions.words} >
                <IconButton color="primary" aria-label="play" onClick={this.playSentence.bind(this)}>
                  <PlayArrow />
                </IconButton>
                <IconButton color="primary" aria-label="play" onClick={this.pauseSentence.bind(this)}>
                  <Pause />
                </IconButton>
              </div>

              <div style={{display:'table-cell',width:'12em'}} class="word" id={this.props.w.id} hidden={!this.props.displayOptions.words} >
                {transcriptions}
              </div>

              {translations}

              <div style={{display:'table-cell'}}>
                {notes}
              </div>       
            </div>
            :
            <div>
              <p>
                {transcriptions}
              </p>

              <p>
                {translations}
              </p>

              <p>
                {notes}
              </p>
            </div>
        }
      

			     
          

        </div>

    );
  }
}

export default Word;