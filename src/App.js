import React from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import Metadata from './Components/Metadata';
import Options from './Components/Options';
import Player from './Components/Player';

import './App.css';

//const parserUrl = "https://eastling.huma-num.fr/player/parser.php";
const parserUrl = "https://eastling.huma-num.fr/player/parser2.php";

class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	hasPrimaryId : false,
	    	hasSecondaryId : false,
	    	isMediaLoaded : false,
	    	isAnnotationsLoaded : false,
	    	hasMediaError : false,
	    	mediaError : {},
			hasAnnotationsError : false,
	    	annotationsError : {},
			METADATA: {},
	      	MEDIAFILE : {},
			annotations : {},
			images : []
	    };
	  }

	getUrlParameter (sVar) {
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}

	  componentDidMount(){
	  	//15/07/2020 : changement suggéré par Edouard Sombié. oai_primary pour le média (audio, vidéo), oai_secondary pour le fichier d'annotations
	  	var oai_primary = this.getUrlParameter("oai_primary");
	  	var oai_secondary = this.getUrlParameter("oai_secondary");

	  	if(oai_primary.length > 0){

	  		this.setState({
	            hasPrimaryId: true,
	        });

	        fetch(parserUrl+"?oai_primary="+oai_primary)
		    //fetch(parserUrl+"?idDoc="+oai_primary)

		      .then(res => res.json())
		      .then(
		        (result) => {

			        if(result.metadata["OAI-PMH"].error != undefined){
			        	this.setState({
				            isMediaLoaded: true,
				            hasMediaError:true,
				            mediaError: result.metadata["OAI-PMH"].error
				          });
			        }else{
			        	var mediaType = "";
			        	var mediaUrl = "";

			        	if(result.audio !=null){
			        		mediaType = "audio";
			        		mediaUrl = result.audio;
			        	}
			        	if(result.video !=null){
			        		mediaType = "video";
			        		mediaUrl = result.video;
			        	}
			        	

			        	this.setState({
				            isMediaLoaded: true,
				            METADATA :  {"data":result.metadata},
				            MEDIAFILE : {"type":mediaType,"url":mediaUrl},
				            images : result.images
				          });
			        }
 
		        },
		        // Remarque : il est important de traiter les erreurs ici
		        // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
		        // des exceptions provenant de réels bugs du composant.
		        (error) => {
		          console.log(error);

		        }
		      )
	  	}

	  	if(oai_secondary.length > 0){

	  		this.setState({
	            hasSecondaryId: true,
	        });

	        fetch(parserUrl+"?oai_secondary="+oai_secondary)
		      .then(res => res.json())
		      .then(
		        (result) => {

			        if(result.annotations["TEXT"] == undefined){
			        	this.setState({
				            isAnnotationsLoaded: true,
				            hasAnnotationsError:true,
				            annotationsError: "No result"
				          });
			        }else{			
			        	this.setState({
				            isAnnotationsLoaded: true,
				            annotations : result.annotations.TEXT.S,
				          });
			        }
 
		        },
		        // Remarque : il est important de traiter les erreurs ici
		        // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
		        // des exceptions provenant de réels bugs du composant.
		        (error) => {
		          console.log(error);

		        }
		      )
	  	}

	  }


	  render(){
	  	return (
		    <div className="App">	

		    	{ 
		    	 	this.state.hasPrimaryId
		    	 	?
		    	 	[
		    	 	this.state.isMediaLoaded 
		    	 	? 
		    	 	[
		    	 	this.state.hasMediaError 
		    	 	?
		    	 	<Container>
					    <p>Error executing request to OAI-PMH:</p>
					    <p>Code :{this.state.mediaError.code}</p>
					    <p>Details :{this.state.mediaError.text}</p>
			    	</Container>
		    	 	:
		    	 	<Container>
					    {/* <Metadata file={this.state.METADATA} /> */}
					    <Player file={this.state.MEDIAFILE} />
			    	</Container>
			    	]
			    	:
			    	<CircularProgress />
			    	]
			    	:
			    	<div>No Media</div>
			    }

			    { 

		    	 	this.state.hasSecondaryId
		    	 	?
		    	 	[
		    	 	this.state.isAnnotationsLoaded 
		    	 	? 
		    	 	[
		    	 	this.state.hasAnnotationsError 
		    	 	?
		    	 	<Container>
					    <p>Error getting annotations :</p>
					    <p>Code :{this.state.annotationsError.code}</p>
					    <p>Details :{this.state.annotationsError.text}</p>
			    	</Container>
		    	 	:
		    	 	<Container>
					    <Options annotations={this.state.annotations} images={this.state.images}/>
			    	</Container>
			    	]
			    	:
			    	<CircularProgress />
			    	]
			    	:
			    	<div>No Annotations</div>
			    }
		    </div>
		  );
	  }
  
}

export default App;
