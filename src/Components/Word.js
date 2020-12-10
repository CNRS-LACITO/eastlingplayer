import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Popover, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';
import Note from './Note';
import Morpheme from './Morpheme';


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
      this.idNote = this.props.idNote - 1;
	}

  playSentence(){
    document.getElementById('player').currentTime = this.props.w.AUDIO.start;
    document.getElementById('player').play();
  }

  pauseSentence(){
    document.getElementById('player').pause();
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

  getNotes(node,notesJSON){
    if(node.NOTE !== undefined && node.NOTE !== null){
      if(node.NOTE.length === undefined){
          notesJSON.push({"id":this.idNote,"note": node.NOTE.message + node.NOTE.text,"hidden" : !this.props.displayOptions.notes.includes(node.NOTE['xml:lang']),lang:node.NOTE["xml:lang"]});
          this.idNote++;
      }else{
        node.NOTE.forEach((f) => {
            notesJSON.push({"id":this.idNote,"note": f.message + f.text,"hidden" :!this.props.displayOptions.notes.includes(f['xml:lang']), lang:f["xml:lang"]});
            this.idNote++;
          });
      }
    }
  }
/*
  componentDidMount() {
      if(this.props.w.AUDIO != undefined){
        window.timeList.push({
          start:parseFloat(this.props.w.AUDIO.start).toFixed(3),
          end:parseFloat(this.props.w.AUDIO.end).toFixed(3),
          mID:null,
          wID:this.props.w.id,
          sID:this.props.sID
        });
      }
  }
*/
  render() {

    const buttonStyle = {
      'text-transform': 'lowercase'
    }

  	let word = "";
    const transcriptions = [];
  	const translations = [];
    const notes = [];
    const notesJSON = [];



    //cas où une seule balise FORM est trouvé=>converti en objet et pas en tableau
    //<div style={{display:'table-cell'}}>

    if(this.props.w.TRANSL != undefined && this.props.w.TRANSL !== null){
	    if(this.props.w.TRANSL.length == undefined){
        var isGlossIncluded = this.props.displayOptions.wordTranslations.includes(this.props.w.TRANSL["xml:lang"]);
        var thisClassName = (this.props.isWordList === true)?'wordlistWord':'word';

	      translations.push(
	              <Typography variant="body2" component={this.props.isWordList === true ? 'div':'p'} style={!isGlossIncluded?{display:'none'}:{visibility:'inherit'}} className={`translation ${thisClassName} word-${this.props.w.TRANSL['xml:lang']}`}>
	                {this.props.w.TRANSL.text}
	              </Typography>
	            );
	    }else{
	      this.props.w.TRANSL.forEach((t) => {
            var isGlossIncluded = this.props.displayOptions.wordTranslations.includes(t["xml:lang"]);
            var thisClassName = (this.props.isWordList === true)?'wordlistWord':'word';

	          translations.push(
	              <Typography variant="body2" component={this.props.isWordList ===true ? 'div':'p'} style={!isGlossIncluded?{display:'none'}:{visibility:'inherit'}}  className={`translation ${thisClassName} word-${t['xml:lang']}`}>
	                {t.text}
	              </Typography>
	            );
	        });
	    }
    }

  // Get note(s) of the sentence
  /*
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
*/

  // Get note(s) of the word
  this.getNotes(this.props.w,notesJSON);

  notesJSON.forEach((n)=>{
    notes.push(<Note id={n.id} note={n.note} hidden={n.hidden} lang={n.lang}></Note>);
   });
    
  //
  if(this.props.w.FORM !== undefined && this.props.w.FORM !== null){
      if(this.props.w.FORM.length == undefined){
        transcriptions.push(
                  <Typography variant="body2" component="p" className={`transcription word-${this.props.w.FORM.kindOf}`}>
                    {this.props.w.FORM.text}{notesJSON.map(n=><sup class={"circle note "+n.lang}>{n.id}</sup>)}
                  </Typography>
                );
                word = this.props.w.FORM.text;
        }else{
          this.props.w.FORM.forEach((f) => {
              transcriptions.push(
                  <Typography variant="body2" component="p" className={`transcription word-${f.kindOf}`}>
                    {f.text}{notesJSON.map(n=><sup class={"circle note "+n.lang}>{n.id}</sup>)}
                  </Typography>
                );
            });
            word = this.props.w.FORM[0].text;
        }
  }

  var hasMorphemes = false;
  var morphemes = [];

  if(this.props.w.M !== undefined && this.props.w.M !== null){
          hasMorphemes = true;
          
            if(this.props.w.M.length>0){
              
              this.props.w.M.forEach((m) =>{
                morphemes.push(
                      <Morpheme w={m} displayOptions={this.props.displayOptions} isMorph={true} idNote={this.idNote} />
                  );
              });
              

            }else{
            morphemes.push(
                      <Morpheme w={this.props.w.M} displayOptions={this.props.displayOptions} isMorph={true} idNote={this.idNote} />
                  );
            }
    }

    return (
      <div id={this.props.w.id} class="WORD" style={this.props.isWordList===true ? {} : {display:"inline-block"} } ref={el => (this.instance = el)} >
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
              {morphemes}
              {translations}

              <div style={{display:'table-cell'}}>
                {notes}
              </div>       
            </div>
            :
            <div>
              <div class="transcBlock">
                {transcriptions}
              </div>
              <div class="morphemesBlock">
                {morphemes}
              </div>
              <div class="translBlock">
                {translations}
              </div>

            </div>
        }    

        </div>

    );
  }
}

export default Word;