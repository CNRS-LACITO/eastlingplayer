<<<<<<< HEAD
import React from 'react';
import Picture from './Picture';
import Word from './Word';
import { Card, CardHeader, Avatar, CardContent, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

import blue from "@material-ui/core/colors/blue";

class Sentence extends React.Component {

	constructor(props) {
	    super(props);
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
	const notes = [];
	const words = [];
	const areas = [];
	const canvas = [];

	// Get translation(s) of the sentence
	if(this.props.s.TRANSL != undefined){
		if(this.props.s.TRANSL.length == undefined){
			translations.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.TRANSL["xml:lang"]}: <b><i>{this.props.s.TRANSL.text}</i></b>
			        </Typography>
		        );
		}else{
			this.props.s.TRANSL.forEach((t) => {
		      translations.push(
		        	<Typography variant="body2" component="p">
			        	{t["xml:lang"]}: <b><i>{t.text}</i></b>
			       	</Typography>
		        );
		    });
		}
	}
	
//
	// Get transcription(s) of the sentence
	if(this.props.s.FORM != undefined){
		if(this.props.s.FORM.length == undefined){
			transcriptions.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.FORM.kindOf}: <b>{this.props.s.FORM.text}</b>
			        </Typography>
		        );
		}else{
			this.props.s.FORM.forEach((f) => {
		      transcriptions.push(
		          <Typography variant="body2" component="p">
			          {f.kindOf}: <b>{f.text}</b>
			        </Typography>
		        );
		    });
		}
	}
  	

	// Get note(s) of the sentence
	if(this.props.s.NOTE != undefined){
		if(this.props.s.NOTE.length == undefined){
			notes.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.NOTE["xml:lang"]}: <b>{this.props.s.NOTE.message}</b> <b>{this.props.s.NOTE.text}</b>
			        </Typography>
		        );
		}else{
			this.props.s.NOTE.forEach((f) => {
		      notes.push(
		          <Typography variant="body2" component="p">
			          {f["xml:lang"]}: <b>{f.message}</b> <b>{f.text}</b>
			        </Typography>
		        );
		    });
		}
	}
  	


    
    if(this.props.s.AREA != undefined){
    	var coords = this.props.s.AREA.coords.split(',');
	    var delta_x = coords[0];//offset for x, image positioning
	    var delta_y = coords[1];//offset for y, image positioning
	}

		
		// Get note(s) of the sentence
	if(this.props.s.W != undefined){

		//W can be an array or an object depending on the number of children in the XML
		//Object if only one Word, Array if more than 1 word
		

		if(Array.isArray(this.props.s.W)){
			//get words of the sentence
		    this.props.s.W.forEach((w) => {

		    	if(w.M != undefined){

		    		if(w.M.length>0){
		    			w.M.forEach((m) =>{
			    			words.push(
				          		<Word w={m} />
				        	);
			    		});
		    		}else{
		    			words.push(
				          		<Word w={w.M} />
				        	);
		    		}


		    	}else{
		    		words.push(
			          	<Word w={w} />
			        );

			        if(w.AREA != undefined){
			        	var coords = w.AREA.coords.split(',');
				        coords[0] -= delta_x;
				        coords[1] -= delta_y;
						coords[2] -= delta_x;
				        coords[3] -= delta_y;

				        var newCoords = coords.join(',');
				        var canvasStyle = {
				        	'position': 'absolute',
				        	'top': coords[1],
				        	'left': coords[0],
				        	
				        }

				        // Get transcription(s) of the word
				        var word="";
					  	if(w.FORM.length == undefined){
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
	    
    
    var avatarStyle={
    	'backgroundColor': blue[800]
    }

    return (
      <div>
		<Card>
			<CardHeader
		        avatar={
		          <Avatar aria-label="sentenceId" style={avatarStyle}>
		            S{this.props.sID}
		          </Avatar>
		        }
		        
		      />
	      <CardContent>
	      	
	      		{(this.props.s.AREA != undefined) ? 
	      		(
	      		<Picture sentenceId={this.props.s.id} imageSrc={this.props.imageSrc} canvas={canvas} area={this.props.s.AREA} />
	      		):(<div></div>)
	      		}
	       	
	        <div style={{textAlign:"initial"}}>

	        	<IconButton color="primary" aria-label="play" onClick={this.playSentence.bind(this)}>
				  <PlayArrow />
				</IconButton>
				<IconButton color="primary" aria-label="play" onClick={this.pauseSentence.bind(this)}>
				  <Pause />
				</IconButton>
				<p hidden={!this.props.displayOptions.checkedWords}>
				{words}
				</p>
				<p hidden={!this.props.displayOptions.checkedTranscriptionBySentence}>
	        	{transcriptions}
	        	</p>
	        	<p hidden={!this.props.displayOptions.checkedTranslationBySentence}>
	        	{translations}
	        	</p>
	        	<p>
	        	{notes}
	        	</p>
	        	
	        </div> 
	      </CardContent>
	    </Card>
	    <Divider light />
      </div>
    );
  }
}

=======
import React from 'react';
import Picture from './Picture';
import Word from './Word';
import { Card, CardHeader, Avatar, CardContent, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

import blue from "@material-ui/core/colors/blue";

class Sentence extends React.Component {

	constructor(props) {
	    super(props);
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
	const notes = [];
	const words = [];
	const areas = [];
	const canvas = [];

	// Get translation(s) of the sentence
	if(this.props.s.TRANSL != undefined){
		if(this.props.s.TRANSL.length == undefined){
			translations.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.TRANSL["xml:lang"]}: <b><i>{this.props.s.TRANSL.text}</i></b>
			        </Typography>
		        );
		}else{
			this.props.s.TRANSL.forEach((t) => {
		      translations.push(
		        	<Typography variant="body2" component="p">
			        	{t["xml:lang"]}: <b><i>{t.text}</i></b>
			       	</Typography>
		        );
		    });
		}
	}
	
//
	// Get transcription(s) of the sentence
	if(this.props.s.FORM != undefined){
		if(this.props.s.FORM.length == undefined){
			transcriptions.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.FORM.kindOf}: <b>{this.props.s.FORM.text}</b>
			        </Typography>
		        );
		}else{
			this.props.s.FORM.forEach((f) => {
		      transcriptions.push(
		          <Typography variant="body2" component="p">
			          {f.kindOf}: <b>{f.text}</b>
			        </Typography>
		        );
		    });
		}
	}
  	

	// Get note(s) of the sentence
	if(this.props.s.NOTE != undefined){
		if(this.props.s.NOTE.length == undefined){
			notes.push(
		          <Typography variant="body2" component="p">
			          {this.props.s.NOTE["xml:lang"]}: <b>{this.props.s.NOTE.message}</b> <b>{this.props.s.NOTE.text}</b>
			        </Typography>
		        );
		}else{
			this.props.s.NOTE.forEach((f) => {
		      notes.push(
		          <Typography variant="body2" component="p">
			          {f["xml:lang"]}: <b>{f.message}</b> <b>{f.text}</b>
			        </Typography>
		        );
		    });
		}
	}
  	


    
    if(this.props.s.AREA != undefined){
    	var coords = this.props.s.AREA.coords.split(',');
	    var delta_x = coords[0];//offset for x, image positioning
	    var delta_y = coords[1];//offset for y, image positioning
	}

		
		// Get note(s) of the sentence
	if(this.props.s.W != undefined){

		//W can be an array or an object depending on the number of children in the XML
		//Object if only one Word, Array if more than 1 word
		

		if(Array.isArray(this.props.s.W)){
			//get words of the sentence
		    this.props.s.W.forEach((w) => {

		    	if(w.M != undefined){

		    		if(w.M.length>0){
		    			w.M.forEach((m) =>{
			    			words.push(
				          		<Word w={m} />
				        	);
			    		});
		    		}else{
		    			words.push(
				          		<Word w={w.M} />
				        	);
		    		}


		    	}else{
		    		words.push(
			          	<Word w={w} />
			        );

			        if(w.AREA != undefined){
			        	var coords = w.AREA.coords.split(',');
				        coords[0] -= delta_x;
				        coords[1] -= delta_y;
						coords[2] -= delta_x;
				        coords[3] -= delta_y;

				        var newCoords = coords.join(',');
				        var canvasStyle = {
				        	'position': 'absolute',
				        	'top': coords[1],
				        	'left': coords[0],
				        	
				        }

				        // Get transcription(s) of the word
				        var word="";
					  	if(w.FORM.length == undefined){
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
	    
    
    var avatarStyle={
    	'backgroundColor': blue[800]
    }

    return (
      <div>
		<Card>
			<CardHeader
		        avatar={
		          <Avatar aria-label="sentenceId" style={avatarStyle}>
		            S{this.props.sID}
		          </Avatar>
		        }
		        
		      />
	      <CardContent>
	      	
	      		{(this.props.s.AREA != undefined) ? 
	      		(
	      		<Picture sentenceId={this.props.s.id} imageSrc={this.props.imageSrc} canvas={canvas} area={this.props.s.AREA} />
	      		):(<div>No image</div>)
	      		}
	       	
	        <div style={{textAlign:"initial"}}>

	        	<IconButton color="primary" aria-label="play" onClick={this.playSentence.bind(this)}>
				  <PlayArrow />
				</IconButton>
				<IconButton color="primary" aria-label="play" onClick={this.pauseSentence.bind(this)}>
				  <Pause />
				</IconButton>
				<p hidden={!this.props.displayOptions.checkedWords}>
				{words}
				</p>
				<p hidden={!this.props.displayOptions.checkedTranscriptionBySentence}>
	        	{transcriptions}
	        	</p>
	        	<p hidden={!this.props.displayOptions.checkedTranslationBySentence}>
	        	{translations}
	        	</p>
	        	<p>
	        	{notes}
	        	</p>
	        	
	        </div> 
	      </CardContent>
	    </Card>
	    <Divider light />
      </div>
    );
  }
}

>>>>>>> b41ec341fc1a27e65269b27ad4962fc772dd46d3
export default Sentence;