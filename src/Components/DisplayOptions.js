import React from 'react';
import { FormGroup, FormControlLabel, FormLabel, Switch, Checkbox } from '@material-ui/core';

class DisplayOptions extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
        words : this.props.displayOptions.words,
        textTranscriptions: (this.props.displayOptions.textTranscriptions.length > 0) ? this.props.displayOptions.textTranscriptions:[this.props.options.text.transcriptions[0]],
        textTranslations: (this.props.displayOptions.textTranslations.length > 0) ? this.props.displayOptions.textTranslations:[this.props.options.text.translations[0]],
        sentenceTranscriptions: (this.props.displayOptions.sentenceTranscriptions.length > 0) ? this.props.displayOptions.sentenceTranscriptions:[this.props.options.sentence.transcriptions[0]],
        sentenceTranslations: (this.props.displayOptions.sentenceTranslations.length > 0) ? this.props.displayOptions.sentenceTranslations:[this.props.options.sentence.translations[0]],
        wordTranscriptions: (this.props.displayOptions.wordTranscriptions.length > 0) ? this.props.displayOptions.wordTranscriptions:[this.props.options.word.transcriptions[0]],
        wordTranslations: (this.props.displayOptions.wordTranslations.length > 0) ? this.props.displayOptions.wordTranslations:[this.props.options.word.translations[0]],
        morphemeTranscriptions: (this.props.displayOptions.morphemeTranscriptions.length > 0) ? this.props.displayOptions.morphemeTranscriptions:[this.props.options.morpheme.transcriptions[0]],
        morphemeTranslations: (this.props.displayOptions.morphemeTranslations.length > 0) ? this.props.displayOptions.morphemeTranslations:[this.props.options.morpheme.translations[0]],
        displayNotes: this.props.displayOptions.notes,
        langOptions:this.props.langOptions,
        options:this.props.options
    };

    console.log(props.langOptions);


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
      params.set('optionTextTranscriptions',this.state.textTranscriptions.join('+'));
      params.set('optionTextTranslations',this.state.textTranslations.join('+'));
      params.set('optionSentenceTranscriptions',this.state.sentenceTranscriptions.join('+'));
      params.set('optionSentenceTranslations',this.state.sentenceTranslations.join('+'));
      params.set('optionWordTranscriptions',this.state.wordTranscriptions.join('+'));
      params.set('optionWordTranslations',this.state.wordTranslations.join('+'));
      params.set('optionMorphemeTranscriptions',this.state.morphemeTranscriptions.join('+'));
      params.set('optionMorphemeTranslations',this.state.morphemeTranslations.join('+'));
      params.set('optionNotes',this.state.displayNotes.join('+'));
      params.set('optionWords',this.state.words);

      var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

      window.history.pushState('test','',newUrl);
  }

  checkTranscriptions(){
    document.querySelectorAll('.wholeTranscriptions').forEach(
      function(e){
        e.style.display='none';
      });

    var checkedTranscriptions = this.state.displayTextTranscriptions;
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

    });
  }

  handleTranscriptionOptions(event){

    if(event.target.name.length >0 ){
      var inputName = event.target.name.split('-');
      var checkedTranscriptions = this.state[[inputName[0]]+"Transcriptions"];

      const index = checkedTranscriptions.indexOf(inputName[1]);

      if (index > -1) {
        //if the transcription is disabled
        checkedTranscriptions.splice(index, 1);

        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });

      }else{
        checkedTranscriptions.push(inputName[1]);

        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
      }


      this.setState({[inputName[0]+'Transcriptions']: checkedTranscriptions},this.buildUrl());

    }
    
  }

  handleTranslationOptions(event){
    if(event.target.name.length >0 ){
      var inputName = event.target.name.split('-');
      var checkedTranslations = this.state[[inputName[0]]+"Translations"];

      const index = checkedTranslations.indexOf(inputName[1]);
      if (index > -1) {
        checkedTranslations.splice(index, 1);
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });
      }else{
        checkedTranslations.push(inputName[1]);
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display='block';
          });
      }

      this.setState({[inputName[0]+'Translations']: checkedTranslations},this.buildUrl());

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
        <FormLabel component="legend">Text transcriptions</FormLabel>
        <FormGroup>
        {this.state.options.text.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.textTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"text-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransl">
        <FormLabel component="legend">Text translations</FormLabel>
        <FormGroup>
        {this.state.options.text.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.textTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"text-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransc">
        <FormLabel component="legend">Sentence transcriptions</FormLabel>
        <FormGroup>
        {this.state.options.sentence.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.sentenceTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"sentence-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransl">
        <FormLabel component="legend">Sentence translations</FormLabel>
        <FormGroup>
        {this.state.options.sentence.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.sentenceTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"sentence-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransc">
        <FormLabel component="legend">Word transcriptions</FormLabel>
        <FormGroup>
        {this.state.options.word.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.wordTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"word-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransl">
        <FormLabel component="legend">Word translations</FormLabel>
        <FormGroup>
        {this.state.options.word.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.wordTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"word-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransc">
        <FormLabel component="legend">Morpheme transcriptions</FormLabel>
        <FormGroup>
        {this.state.options.morpheme.transcriptions.map(transc => (
          <FormControlLabel
            control={<Checkbox checked={this.state.morphemeTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"morpheme-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div class="optionTransl">
        <FormLabel component="legend">Morpheme translations</FormLabel>
        <FormGroup>
        {this.state.options.morpheme.translations.map(transl => (
          <FormControlLabel
            control={<Checkbox checked={this.state.morphemeTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"morpheme-"+transl} />}
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
                labelPlacement="start"
              />
            }
            label="Words"
          />
        </div>

          <div class="optionNotes">
          <FormLabel component="legend">Notes</FormLabel>
          <FormGroup>
          {this.state.options.note.translations.map(nl => (
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