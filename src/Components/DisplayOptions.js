import React from 'react';
import { FormGroup, FormControl, InputLabel, Select, MenuItem, FormControlLabel, FormLabel, Switch, Checkbox } from '@material-ui/core';

class DisplayOptions extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
        checkedWholeTranscriptions: this.props.displayOptions.wholeTranscriptions,
        displayWholeTranslations: this.props.displayOptions.wholeTranslations,
        words : this.props.displayOptions.words,
        notes : this.props.displayOptions.notes,
        displayTranscriptions: this.props.displayOptions.transcriptions,
        displayTranslations: this.props.displayOptions.translations,
        displayGlosses: this.props.displayOptions.glosses,
        langOptions:this.props.langOptions
    };
  }

 

  buildUrl(){

      var params = new URLSearchParams(window.location.search);
      params.set('optionWords',this.state.words.toString());
      params.set('optionNotes',this.state.notes.toString());
      params.set('optionTranscriptions',this.state.displayTranscriptions.join('+'));
      params.set('optionTranslations',this.state.displayTranslations.join('+'));
      params.set('optionGlosses',this.state.displayGlosses.join('+'));
      params.set('optionWholeTranscriptions',this.state.checkedWholeTranscriptions.toString());
      params.set('optionWholeTranslations',this.state.displayWholeTranslations.join('+'));

      var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

      window.history.pushState('test','',newUrl);


  }

  handleChecked(event){
    var checked = event.target.checked;
    var name = event.target.name;
    this.setState({[event.target.name]: checked},()=>{
      this.buildUrl();

      if(name == "words")
      document.querySelectorAll('.word').forEach(
          function(e){
            //e.style.display='none';
            (checked==true)?e.style.display='block':e.style.display='none';
          });

      if(name == "notes")
      document.querySelectorAll('.note').forEach(
          function(e){
            //e.style.display='none';
            (checked==true)?e.style.display='block':e.style.display='none';
          });

      if(name == "checkedWholeTranscriptions")
      document.querySelectorAll('.wholeTranscriptions').forEach(
          function(e){
            //e.style.display='none';
            (checked==true)?e.style.display='block':e.style.display='none';
          });

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
            e.style.display='block';
          });
      }

      this.setState({displayGlosses: checkedGlosses},this.buildUrl());

    }
    
  }

  render() {

    return (
      <div>
        <h2>Display Options</h2>
        {

        <FormGroup row>

        <FormLabel component="legend">Transcriptions</FormLabel>
        <FormGroup>
        {this.state.langOptions.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={transc} />}
            label={transc}
          />
        ))}
        </FormGroup>

        <FormLabel component="legend">Translations</FormLabel>
        <FormGroup>
        {this.state.langOptions.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={transl} />}
            label={transl}
          />
        ))}
        </FormGroup>           


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

          
          <FormLabel component="legend">Whole text translation</FormLabel>
        <FormGroup>
        {this.state.langOptions.wholeTranslations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.displayWholeTranslations.includes(transl)} onChange={this.handleWholeTranslationOptions.bind(this)} name={transl} />}
            label={transl}
          />
        ))}
        </FormGroup> 

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

          <FormLabel component="legend">Glosses</FormLabel>
          <FormGroup>
          {this.state.langOptions.glosses.map(gl => (
            <FormControlLabel
              control={<Checkbox checked={this.state.displayGlosses.includes(gl)} onChange={this.handleGlossesOptions.bind(this)} name={gl} />}
              label={gl}
            />
          ))}
          </FormGroup>

          <FormControlLabel
            control={
              <Switch
                checked={this.state.notes}
                onChange={this.handleChecked.bind(this)}
                name="notes"
                color="primary"
              />
            }
            label="Notes"
          />

          </FormGroup>

          }

      </div>
    );
  }
}

export default DisplayOptions;