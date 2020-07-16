import React from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import Metadata from './Components/Metadata';
import Options from './Components/Options';
import Player from './Components/Player';

import './App.css';

const parserUrl = "https://eastling.huma-num.fr/player/parser.php";

class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	hasId : false,
	    	isLoaded : false,
	    	hasError : false,
	    	error : {},
			METADATA: {},
	      	MEDIAFILE : {},
			ANNOTATIONFILES : [],
			selectedFile : {},
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
	            hasId: true,
	        });


	        //fetch(parserUrl+"?oai_primary="+oai_primary)
		    fetch(parserUrl+"?idDoc="+oai_primary)

		      .then(res => res.json())
		      .then(
		        (result) => {

			        if(result.metadata["OAI-PMH"].error != undefined){
			        	this.setState({
				            isLoaded: true,
				            hasError:true,
				            error: result.metadata["OAI-PMH"].error
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
				            isLoaded: true,
				            METADATA :  {"data":result.metadata},
				            ANNOTATIONFILES : result.annotations,
				            MEDIAFILE : {"type":mediaType,"url":mediaUrl},
				            selectedFile : result.annotations[0],
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

	  }


	  render(){
	  	return (
		    <div className="App">	

		    	{ 
		    	 	this.state.hasId
		    	 	?
		    	 	[
		    	 	this.state.isLoaded 
		    	 	? 
		    	 	[
		    	 	this.state.hasError 
		    	 	?
		    	 	<Container>
					    <p>Error executing request to OAI-PMH:</p>
					    <p>Code :{this.state.error.code}</p>
					    <p>Details :{this.state.error.text}</p>
			    	</Container>
		    	 	:
		    	 	<Container>
					    {/* <Metadata file={this.state.METADATA} /> */}

					    <Player file={this.state.MEDIAFILE} />
					    <Options files={this.state.ANNOTATIONFILES} selectedFile={this.state.selectedFile} images={this.state.images}/>
			    	</Container>
			    	]
			    	:
			    	<CircularProgress />
			    	]
			    	:
			    	[

			    	<Container>
			    		<p>Document ID not provided in URL.</p>
			    		<p>(URL must include the oai_primary parameter as following:  url<b>?oai_primary=[cocoon id]</b>)</p>

			    	</Container>
			    	]
			    }
		    </div>
		  );
	  }
  
}

export default App;
