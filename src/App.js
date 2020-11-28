import React from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import Metadata from './Components/Metadata';
import DisplayOptions from './Components/DisplayOptions';
import Player from './Components/Player';
import Annotations from './Components/Annotations';

import './App.css';

const parserUrl = "https://eastling.huma-num.fr/player/parserMySQL.php";

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
			doi : '',
			images : [],
			displayOptions : {},
			langOptions : {
				transcriptions:[],translations:[]
			},
			isWordList : false
	    };
	  }



	getUrlParameter (sVar) {
		return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}

	componentDidMount(){
	  	//15/07/2020 : changement suggéré par Edouard Sombié. oai_primary pour le média (audio, vidéo), oai_secondary pour le fichier d'annotations
	  	var oai_primary = this.getUrlParameter("oai_primary");
	  	var oai_secondary = this.getUrlParameter("oai_secondary");
	  	//25/08/2020 : récupérer les options d'affichage dans l'URL (Edouard SOMBIE)
	  	var optionTranscriptions = this.getUrlParameter("optionTranscriptions");
	  	var optionTranslations = this.getUrlParameter("optionTranslations");
	  	var optionWholeTranscriptions = this.getUrlParameter("optionWholeTranscriptions");
	  	var optionWholeTranslations = this.getUrlParameter("optionWholeTranslations");
	  	var optionWords = this.getUrlParameter("optionWords");
	  	var optionNotes = this.getUrlParameter("optionNotes");
	  	var optionGlosses = this.getUrlParameter("optionGlosses");
	  	var optionLang = this.getUrlParameter("optionLang");
	  	//28/08/2020
	  	//TODO gérer option Lang soit fr soit en, par défaut FR dans URL pour les translations options et libellés

	  	this.setState({
	        displayOptions: {
	        	transcriptions : optionTranscriptions.split('+'),
	        	translations : optionTranslations.split('+'),
	        	glosses : optionGlosses.split('+'),
	        	notes : optionNotes.split('+'),
	        	wholeTranscriptions : (optionWholeTranscriptions == 'true'),
	        	wholeTranslations : optionWholeTranslations.split('+'),
	        	words : (optionWords == 'true')
	        },
	    });
	  	

	  	if(oai_primary.length > 0){

	  		this.setState({
	            hasPrimaryId: true,
	        });

	        fetch(parserUrl+"?oai_primary="+oai_primary)
		    //fetch(parserUrl+"?idDoc="+oai_primary)

		      .then(res => res.json())
		      .then(
		        (result) => {

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
		    //fetch('https://eastling.huma-num.fr/player/parserFake.php?oai_secondary=EEE')
		      .then(res => res.json())
		      .then(
		        (result) => {
		        	console.log(result);
			        if(result.annotations["TEXT"] == undefined){
			        	this.setState({
				            isAnnotationsLoaded: true,
				            hasAnnotationsError:true,
				            annotationsError: "No result"
				          });
			        }else{	
			        	//27/08/2020 : options de langues
			        	if(result.annotations.WORDLIST !== undefined && result.annotations.WORDLIST !== null){
			        		var isWordList = (result.annotations.WORDLIST.W !== undefined && result.annotations.WORDLIST.W !== null) ? true : false;
			        	}
			        	
			        	this.setState({
			        		langOptions: result.langues,
				            isAnnotationsLoaded: true,
				            annotations : result.annotations,
				            doi : result.doi,
				            isWordList : isWordList
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
	  	console.log("render App");
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
		    	 	<div key={this.state.doi}>
		    	 	<Container>
					    <DisplayOptions displayOptions={this.state.displayOptions} langOptions={this.state.langOptions} isWordList={this.state.isWordList}/>
			    	</Container>
			    	<Container>
 						<Annotations doi={this.state.doi} displayOptions={this.state.displayOptions} annotations={this.state.annotations} images={this.state.images} video={this.state.MEDIAFILE.type==="video"} />
 			    	</Container>
 			    	</div>
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
