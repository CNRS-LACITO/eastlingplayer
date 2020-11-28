import React from 'react';
import { FormGroup, FormControlLabel, FormLabel, Switch, Checkbox } from '@material-ui/core';

class DisplayOptions extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
        checkedWholeTranscriptions: this.props.displayOptions.wholeTranscriptions,
        displayWholeTranslations: this.props.displayOptions.wholeTranslations,
        words : this.props.displayOptions.words,
        displayTranscriptions: (this.props.displayOptions.transcriptions.length > 0) ? this.props.displayOptions.transcriptions:[this.props.langOptions.transcriptions[0]],
        displayTranslations: (this.props.displayOptions.translations.length > 0) ? this.props.displayOptions.translations:[this.props.langOptions.translations[0]],
        displayGlosses: this.props.displayOptions.glosses,
        displayNotes: this.props.displayOptions.notes,
        langOptions:this.props.langOptions
    };


    /*
    this.state.langOptions.transcriptions.forEach((transc) => {
      var newTrack = document.createElement("track");
      newTrack.setAttribute("id",transc);
      newTrack.setAttribute("kind","captions");

      document.querySelector("#player").appendChild(newTrack);
      });

    this.state.langOptions.translations.forEach((transl) => {
      var newTrack = document.createElement("track");
      newTrack.setAttribute("id",transl);
      newTrack.setAttribute("kind","subtitles");
      document.querySelector("#player").appendChild(newTrack);
      });
      */

  }


  buildUrl(){

      var params = new URLSearchParams(window.location.search);
      params.set('optionWords',this.state.words.toString());
      //params.set('optionNotes',this.state.notes.toString());
      params.set('optionTranscriptions',this.state.displayTranscriptions.join('+'));
      params.set('optionTranslations',this.state.displayTranslations.join('+'));
      params.set('optionGlosses',this.state.displayGlosses.join('+'));
      params.set('optionNotes',this.state.displayNotes.join('+'));
      params.set('optionWholeTranscriptions',this.state.checkedWholeTranscriptions.toString());
      params.set('optionWholeTranslations',this.state.displayWholeTranslations.join('+'));

      var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

      window.history.pushState('test','',newUrl);
  }

  checkTranscriptions(){
    document.querySelectorAll('.wholeTranscriptions').forEach(
      function(e){
        e.style.display='none';
      });

    var checkedTranscriptions = this.state.displayTranscriptions;
    console.log(checkedTranscriptions);
    for(var i=0;i<checkedTranscriptions.length;i++){
      if(checkedTranscriptions[i].length>0){
          document.querySelectorAll('.wholeTranscriptions.'+checkedTranscriptions[i]).forEach(
            function(e){
              e.style.display='block';
            });
      }
   
    }
  }

  handleChecked(event){
    var checked = event.target.checked;
    var name = event.target.name;
    this.setState({[event.target.name]: checked},()=>{
      this.buildUrl();

      if(name === "words")
      document.querySelectorAll('.wordsBlock').forEach(
          function(e){
            //e.style.display='none';
            (checked===true)?e.style.display='block':e.style.display='none';
          });

      if(name === "checkedWholeTranscriptions"){
        if(checked===false){
          document.querySelectorAll('.wholeTranscriptions').forEach(
            function(e){
              e.style.display='none';
            });
        }else{
          this.checkTranscriptions();
        }
      }
      
    

    });
  }

  handleTranscriptionOptions(event){

    if(event.target.name.length >0 ){
      var checkedTranscriptions = this.state.displayTranscriptions;

      const index = checkedTranscriptions.indexOf(event.target.name);
      if (index > -1) {
        //if the transcription is disabled
        checkedTranscriptions.splice(index, 1);

        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });

      }else{
        checkedTranscriptions.push(event.target.name);

        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
      }


      this.setState({displayTranscriptions: checkedTranscriptions},this.buildUrl());
      if(this.state.checkedWholeTranscriptions===true)
        this.checkTranscriptions();

    }
    
  }

  handleTranslationOptions(event){
    if(event.target.name.length >0 ){
      var checkedTranslations = this.state.displayTranslations;

      const index = checkedTranslations.indexOf(event.target.name);
      if (index > -1) {
        checkedTranslations.splice(index, 1);
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });
      }else{
        checkedTranslations.push(event.target.name);
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
      }

      this.setState({displayTranslations: checkedTranslations},this.buildUrl());

    }
    
  }

  handleWholeTranslationOptions(event){
    if(event.target.name.length >0 ){
      var checkedWholeTranslations = this.state.displayWholeTranslations;

      const index = checkedWholeTranslations.indexOf(event.target.name);
      if (index > -1) {
        checkedWholeTranslations.splice(index, 1);
        document.querySelectorAll('.wholetranslation.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });
      }else{
        checkedWholeTranslations.push(event.target.name);
        document.querySelectorAll('.wholetranslation.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
      }

      this.setState({displayWholeTranslations: checkedWholeTranslations},this.buildUrl());

    }
    
  }

  handleGlossesOptions(event){
    if(event.target.name.length >0 ){
      var checkedGlosses = this.state.displayGlosses;
      var isWordList = this.props.isWordList;

      const index = checkedGlosses.indexOf(event.target.name);
      if (index > -1) {
        checkedGlosses.splice(index, 1);
        document.querySelectorAll('.gloss.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });
      }else{
        checkedGlosses.push(event.target.name);

        document.querySelectorAll('.gloss.'+event.target.name).forEach(
          function(e){
            e.style.display=(isWordList === true)?'table-cell':'block';
          });
      }

      this.setState({displayGlosses: checkedGlosses},this.buildUrl());

    }
    
  }

  handleNotesOptions(event){
    if(event.target.name.length >0 ){
      var checkedNotes = this.state.displayNotes;

      const index = checkedNotes.indexOf(event.target.name);
      if (index > -1) {
        checkedNotes.splice(index, 1);
        document.querySelectorAll('.note.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });
      }else{
        checkedNotes.push(event.target.name);
        document.querySelectorAll('.note.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
        document.querySelectorAll('sup.note.'+event.target.name).forEach(
          function(e){
            e.style.display='inline-block';
          });
      }

      this.setState({displayNotes: checkedNotes},this.buildUrl());

    }
    
  }

  render() {

    return (
      <div>
        <h2>Display Options</h2>
        {
        
        <FormGroup row>
        
        <div class="optionTransc">
        <FormLabel component="legend">Transcriptions</FormLabel>
        <FormGroup>
        {this.state.langOptions.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransl">
        <FormLabel component="legend">Translations</FormLabel>
        <FormGroup>
        {this.state.langOptions.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>           

        <div class="optionWholeTransc">
          <FormControlLabel
            control={
              <Switch 
                checked={this.state.checkedWholeTranscriptions}
                onChange={this.handleChecked.bind(this)}
                name="checkedWholeTranscriptions"
                color="primary"
              />
            }
            label="Whole text transcription"
          />
        </div>

        <div class="optionWholeTransl">  
          <FormLabel component="legend">Whole text translation</FormLabel>
        <FormGroup>
        {this.state.langOptions.wholeTranslations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayWholeTranslations.includes(transl)} onChange={this.handleWholeTranslationOptions.bind(this)} name={transl} />}
            label={transl}
          />
        ))}
        </FormGroup> 
        </div>

        <div class="optionWords">
          <FormControlLabel
            control={
              <Switch
                checked={this.state.words}
                onChange={this.handleChecked.bind(this)}
                name="words"
                color="primary"
              />
            }
            label="Words"
          />
        </div>

        <div class="optionGlosses">
          <FormLabel component="legend">Glosses</FormLabel>
          <FormGroup>
          {this.state.langOptions.glosses.map(gl => (
            <FormControlLabel
              control={<Checkbox checked={this.state.displayGlosses.includes(gl)} onChange={this.handleGlossesOptions.bind(this)} name={gl} />}
              label={gl}
            />
          ))}
          </FormGroup>
          </div>

          <div class="optionNotes">
          <FormLabel component="legend">Notes</FormLabel>
          <FormGroup>
          {this.state.langOptions.notes.map(nl => (
            <FormControlLabel
              control={<Checkbox checked={this.state.displayNotes.includes(nl)} onChange={this.handleNotesOptions.bind(this)} name={nl} />}
              label={nl}
            />
          ))}
          </FormGroup>
          </div>

          </FormGroup>

          }

      </div>
    );
  }
}

export default DisplayOptions;