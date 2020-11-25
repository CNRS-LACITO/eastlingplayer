import React, {Fragment} from 'react';
import Picture from './Picture';
import Word from './Word';
import Note from './Note';
import { Card, CardHeader, Avatar, CardContent, Divider, Button, Badge } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

import blue from "@material-ui/core/colors/blue";

class Sentence extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	        displayOptions : this.props.displayOptions,
	        notes : null //#17
	    };
	}

	playSentence(){
		document.getElementById('player').currentTime = this.props.s.AUDIO.start;
		document.getElementById('player').play();
	}

	pauseSentence(){
		document.getElementById('player').pause();
	}
  
  render() {


  	const transcriptions = [];
	const translations = [];
	const notesJSON = [];
	const words = [];
	const canvas = [];

	// Get translation(s) of the sentence
	if(this.props.s.TRANSL !== null && this.props.s.TRANSL !== undefined){
		if(this.props.s.TRANSL.length === undefined){
			translations.push(
		          <Typography hidden={!this.props.displayOptions.translations.includes(this.props.s.TRANSL["xml:lang"])} variant="body2" component="p" className={`translation ${this.props.s.TRANSL['xml:lang']}`}>
			          <b>{this.props.s.TRANSL.text}</b>
			        </Typography>
		        );
		}else{
			this.props.s.TRANSL.forEach((t) => {
		      translations.push(
		        	<Typography hidden={!this.props.displayOptions.translations.includes(t["xml:lang"])} variant="body2" component="p" className={`translation ${t["xml:lang"]}`}>
			        	<b>{t.text}</b>
			       	</Typography>
		        );
		    });
		}
	}
	
	//#17
	var idNote = 1;

	// Get note(s) of the sentence
	if(this.props.s.NOTE !== undefined && this.props.s.NOTE !== null){
		if(this.props.s.NOTE.length === undefined){
			/* #17
			notes.push(
		          <Typography hidden={!this.props.displayOptions.notes.includes(this.props.s.NOTE["xml:lang"])} variant="body2" component="p" className={`note ${this.props.s.NOTE["xml:lang"]}`} >
			          NOTE : {this.props.s.NOTE.message} {this.props.s.NOTE.text}
			        </Typography>
		        );
		        */
		    notesJSON.push({"id":idNote,"note": this.props.s.NOTE.message + this.props.s.NOTE.text,"hidden" : !this.props.displayOptions.notes.includes(this.props.s.NOTE['xml:lang']),lang:this.props.s.NOTE["xml:lang"]});
		    idNote++;
		}else{
			this.props.s.NOTE.forEach((f) => {
		      /*
		      notes.push(
		          <Typography hidden={!this.props.displayOptions.notes.includes(f["xml:lang"])} variant="body2" component="p" className={`note ${f["xml:lang"]}`} >
			          NOTE : {f.message} {f.text}
			        </Typography>
		        );
		        */
		      notesJSON.push({"id":idNote,"note": f.message + f.text,"hidden" :!this.props.displayOptions.notes.includes(f['xml:lang']), lang:f["xml:lang"]});
		      idNote++;
		    });
		}
	}

//
	// Get transcription(s) of the sentence
	if(this.props.s.FORM !== undefined && this.props.s.FORM !== null){
		if(this.props.s.FORM.length === undefined){
			transcriptions.push(
		          <Typography hidden={!this.props.displayOptions.transcriptions.includes(this.props.s.FORM.kindOf)} variant="body2" component="p" className={`transcription ${this.props.s.FORM.kindOf}`}>
			          <b>{this.props.s.FORM.text}</b>{notesJSON.map(n=><sup class='circle'>{n.id}</sup>)}
			        </Typography>
		        );

		}else{
			this.props.s.FORM.forEach((f) => {
		      transcriptions.push(
		          <Typography hidden={!this.props.displayOptions.transcriptions.includes(f.kindOf)} variant="body2" component="p" className={`transcription ${f.kindOf}`}>
			          <b>{f.text}</b>{notesJSON.map(n=><sup class='circle'>n.id</sup>)}
			        </Typography>
		        );
		    });
		}
	}
  	
    
    if(this.props.s.AREA !== undefined && this.props.s.AREA !== null){
    	var coords = this.props.s.AREA.coords.split(',');
	    var delta_x = coords[0];//offset for x, image positioning
	    var delta_y = coords[1];//offset for y, image positioning
	}
	
	// Get word(s) of the sentence
	if(this.props.s.W !== undefined && this.props.s.W !== null){

		//W can be an array or an object depending on the number of children in the XML
		//Object if only one Word, Array if more than 1 word
		

		if(Array.isArray(this.props.s.W)){
			//get words of the sentence
		    this.props.s.W.forEach((w) => {

		    	if(w.M !== undefined && w.M !== null){

		    		if(w.M.length>0){
		    			var divWord;
		    			var morphemes = [];
		    			w.M.forEach((m) =>{
			    			morphemes.push(
				          		<Word w={m} displayOptions={this.props.displayOptions} isMorph={true} />
				        	);
			    		});
			    		divWord = <div id={w.id} class="WORD hasMorphemes" style={{display: "inline-block"}}>{morphemes}</div>;
			    		words.push(divWord);

		    		}else{
		    			words.push(
				          		<Word w={w.M} displayOptions={this.props.displayOptions} isMorph={true} />
				        	);
		    		}


		    	}else{
		    		words.push(
			          	<Word w={w} displayOptions={this.props.displayOptions} />
			        );

			        if(w.AREA !== undefined && w.AREA !== null){
			        	var coords = w.AREA.coords.split(',');
				        coords[0] -= delta_x;
				        coords[1] -= delta_y;
						coords[2] -= delta_x;
				        coords[3] -= delta_y;

				        //var newCoords = coords.join(',');
				        var canvasStyle = {
				        	'position': 'absolute',
				        	'top': coords[1],
				        	'left': coords[0],
				        	
				        }

				        // Get transcription(s) of the word
				        var word="";
					  	if(w.FORM.length === undefined){
					  		word = w.FORM.text
						}else{
						      word = w.FORM[0].text
						}

				        canvas.push(
				        	<canvas title={word} style={canvasStyle} wordid={w.id} width={coords[2]-coords[0]} height={coords[3]-coords[1]} onClick={()=>document.getElementById(w.id).click()} ></canvas>
				        );
				        
			        }
		    	}	
		     	
		    });

		}	
		

	}
	 
	 var notes = [];
	 //#17 NOTES
	 notesJSON.forEach((n)=>{
	 	notes.push(<Note id={n.id} note={n.note} hidden={n.hidden} lang={n.lang}></Note>);
	 });

    
    var avatarStyle={
    	'backgroundColor': blue[800],
    	'display': 'inline-flex'
    }

    return (
      <div>
		<Card> 
	      <CardContent>  	
	      		{(this.props.s.AREA !== undefined) ? 
	      		(
	      		<Picture sentenceId={this.props.s.id} imageSrc={this.props.imageSrc} canvas={canvas} area={this.props.s.AREA} />
	      		):(<div></div>)
	      		}
	       	
	        <div class="SENTENCE" style={{textAlign:"initial"}}>

	        	<Avatar aria-label="sentenceId" style={avatarStyle}>
		            S{this.props.sID} 
		          </Avatar>
				<IconButton href={this.props.doi} target="_blank"><img class="doi" src="/player/images/doi.png" alt="doi" /></IconButton>
	        	<IconButton color="primary" aria-label="play" onClick={this.playSentence.bind(this)}>
				  <PlayArrow />
				</IconButton>
				<IconButton color="primary" aria-label="pause" onClick={this.pauseSentence.bind(this)}>
				  <Pause />
				</IconButton>

				<p class="transcBlock" style={{display: "inline-block"}}>
	        		{transcriptions}
	        	</p>

	        	<p class="wordsBlock" hidden={!this.props.displayOptions.words}>
					{words}
				</p>

	        	<p class="translBlock">
	        		{translations}
	        	</p>

	        	<p class="notesBlock">
	        		{notes}
	        	</p>
	        	
	        </div> 
	      </CardContent>
	    </Card>

      </div>
    );
  }
}

export default Sentence;