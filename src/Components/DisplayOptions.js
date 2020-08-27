import React from 'react';
import { FormGroup, FormControl, InputLabel, Select, MenuItem, FormControlLabel, FormLabel, Switch, Checkbox } from '@material-ui/core';

class DisplayOptions extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
        checkedWholeTranscriptions: false,
        checkedWholeTranslations: false,
        words : this.props.displayOptions.words,
        glosses : this.props.displayOptions.glosses,
        displayTranscriptions: this.props.displayOptions.transcriptions,
        displayTranslations: this.props.displayOptions.translations,
        langOptions:this.props.langOptions
    };
  }


  buildUrl(){
      var params = new URLSearchParams(window.location.search);
      params.set('optionWords',this.state.words.toString());
      params.set('optionGlosses',this.state.glosses.toString());
      params.set('optionTranscriptions',this.state.displayTranscriptions.join('+'));
      params.set('optionTranslations',this.state.displayTranslations.join('+'));
      params.set('optionWholeTranscriptions',this.state.checkedWholeTranscriptions.toString());
      params.set('optionWholeTranslations',this.state.checkedWholeTranscriptions.toString());

      var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

      window.history.pushState('test','',newUrl);
  }

  handleChecked(event){
    //this.setState({checkedTranscriptionBySentence: event.target.checked});
    this.setState({[event.target.name]: event.target.checked});
    this.buildUrl();
  }

  handleTranscriptionOptions(event){

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


    this.setState({displayTranscriptions: checkedTranscriptions});
    this.buildUrl();
  }

  handleTranslationOptions(event){

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

    this.setState({displayTranslations: checkedTranslations});
    this.buildUrl();
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
                disabled 
                checked={this.state.checkedWholeTranscription}
                onChange={this.handleChecked.bind(this)}
                name="checkedWholeTranscription"
                color="primary"
              />
            }
            label="Whole text transcription"
          />

          <FormControlLabel
            control={
              <Switch
                disabled 
                checked={this.state.checkedWholeTranslation}
                onChange={this.handleChecked.bind(this)}
                name="checkedWholeTranslation"
                color="primary"
              />
            }
            label="Whole text translation"
          />

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

          <FormControlLabel
            control={
              <Switch
                checked={this.state.glosses}
                onChange={this.handleChecked.bind(this)}
                name="glosses"
                color="primary"
              />
            }
            label="Glosses"
          />

          </FormGroup>

          }

      </div>
    );
  }
}

export default DisplayOptions;