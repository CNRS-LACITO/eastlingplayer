import React from 'react';
import { FormGroup, FormControlLabel, FormLabel, Checkbox } from '@material-ui/core';
import { Translate } from 'react-translated';

class DisplayOptions extends React.Component {

  constructor(props) {
    
    super(props);

    this.state = {
        //#41 words : this.props.displayOptions.words,
        textTranscriptions: (this.props.displayOptions.textTranscriptions.length > 0) ? this.props.displayOptions.textTranscriptions:[],
        textTranslations: (this.props.displayOptions.textTranslations.length > 0) ? this.props.displayOptions.textTranslations:[],
        sentenceTranscriptions: (this.props.displayOptions.sentenceTranscriptions.length > 0) ? this.props.displayOptions.sentenceTranscriptions:[this.props.options.sentence.transcriptions[0]],
        sentenceTranslations: (this.props.displayOptions.sentenceTranslations.length > 0) ? this.props.displayOptions.sentenceTranslations:[this.props.options.sentence.translations[0]],
        wordTranscriptions: (this.props.displayOptions.wordTranscriptions.length > 0) ? this.props.displayOptions.wordTranscriptions:[],
        wordTranslations: (this.props.displayOptions.wordTranslations.length > 0) ? this.props.displayOptions.wordTranslations:[],
        morphemeTranscriptions: (this.props.displayOptions.morphemeTranscriptions.length > 0) ? this.props.displayOptions.morphemeTranscriptions:[],
        morphemeTranslations: (this.props.displayOptions.morphemeTranslations.length > 0) ? this.props.displayOptions.morphemeTranslations:[],
        displayNotes: this.props.displayOptions.notes,
        options:this.props.options,
        lang:this.props.displayOptions.lang,
        mode:this.props.displayOptions.mode,
        continuousPlay:this.props.displayOptions.continuousPlay,
    };

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
      //#41 params.set('optionWords',this.state.words);
      params.set('lang',this.state.lang);
      params.set('mode',this.state.mode);
      params.set('continuousPlay',this.state.continuousPlay);

      var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

      window.history.pushState('test','',newUrl);
  }


  handleTranscriptionOptions(event){

    if(event.target.name.length >0 ){
      var inputName = event.target.name.split('-');
      var s = [inputName[0]]+"Transcriptions";
      var checkedTranscriptions = this.state[[inputName[0]]+"Transcriptions"];
      
      console.log(s);

      //transName is used because some kindOf or Translation type can contain "-" character
      var transName = event.target.name.split(inputName[0]+'-');

      const index = checkedTranscriptions.indexOf(transName[1]);

      if (index > -1) {
        //if the transcription is disabled
        checkedTranscriptions.splice(index, 1);
        console.log(checkedTranscriptions);
        console.log(this.state);

        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display='none';
          });

      }else{
        checkedTranscriptions.push(transName[1]);
        var isWordList = this.props.isWordList;
        document.querySelectorAll('.transcription.'+event.target.name).forEach(
          function(e){
            e.style.display=(isWordList)?'table-cell':'block';
          });
      }

/////////////////////
      this.setState({
        [inputName[0]+'Transcriptions']: checkedTranscriptions,
        "options" : this.state.options
      },this.buildUrl());

      console.log(this.state);

    }
    
  }

  handleTranslationOptions(event){
    if(event.target.name.length >0 ){
      var inputName = event.target.name.split('-');
      var checkedTranslations = this.state[[inputName[0]]+"Translations"];


      var transName = event.target.name.split(inputName[0]+'-');

      
      const index = checkedTranslations.indexOf(transName[1]);
      if (index > -1) {
        checkedTranslations.splice(index, 1);
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display='none';

          });
      }else{
        checkedTranslations.push(transName[1]);
        var isWordList = this.props.isWordList;
        document.querySelectorAll('.translation.'+event.target.name).forEach(
          function(e){
            e.style.display=(isWordList)?'table-cell':'block';
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

  handleCheck(event){
    if(event.target.name.length >0 ){

      this.setState({[event.target.name]: event.target.checked},this.buildUrl());

    }
    
  }

  render() {
    this.buildUrl();

    return (
      <div>
        <h2><Translate text='Display options'/></h2>
        {
        
        <FormGroup row>
        
        <div className="optionTransc" hidden={this.state.options.text.transcriptions.length===0}>
        <FormLabel component="legend"><Translate text='Text transcription'/></FormLabel>
        <FormGroup>
        {this.state.options.text.transcriptions.map(transc => (
          <FormControlLabel key={"textTranscription"+transc}
            control={<Checkbox checked={this.state.textTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"text-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransl" hidden={this.state.options.text.translations.length===0}>
        <FormLabel component="legend"><Translate text='Text translation'/></FormLabel>
        <FormGroup>
        {this.state.options.text.translations.map(transl => (
          <FormControlLabel key={"textTranslation"+transl}
            control={<Checkbox checked={this.state.textTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"text-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransc" hidden={this.state.options.sentence.transcriptions.length===0}>
        <FormLabel component="legend"><Translate text='Sentence transcription'/></FormLabel>
        <FormGroup>
        {this.state.options.sentence.transcriptions.map(transc => (
          <FormControlLabel key={"sentenceTranscription"+transc}
            control={<Checkbox checked={this.state.sentenceTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"sentence-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransl" hidden={this.state.options.sentence.translations.length===0}>
        <FormLabel component="legend"><Translate text='Sentence translation'/></FormLabel>
        <FormGroup>
        {this.state.options.sentence.translations.map(transl => (
          <FormControlLabel key={"textTranslation"+transl}
            control={<Checkbox checked={this.state.sentenceTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"sentence-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransc" hidden={this.state.options.word.transcriptions.length===0} >
        <FormLabel component="legend"><Translate text='Word transcription'/></FormLabel>
        <FormGroup>
        {this.state.options.word.transcriptions.map(transc => (
          <FormControlLabel key={"wordTranscription"+transc}
            control={<Checkbox checked={this.state.wordTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"word-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransl" hidden={this.state.options.word.translations.length===0}>
        <FormLabel component="legend"><Translate text='Word translation'/></FormLabel>
        <FormGroup>
        {this.state.options.word.translations.map(transl => (
          <FormControlLabel key={"wordTranslation"+transl}
            control={<Checkbox checked={this.state.wordTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"word-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransc" hidden={this.state.options.morpheme.transcriptions.length===0}>
        <FormLabel component="legend"><Translate text='Morpheme transcription'/></FormLabel>
        <FormGroup>
        {this.state.options.morpheme.transcriptions.map(transc => (
          <FormControlLabel key={"morphemeTranscription"+transc}
            control={<Checkbox checked={this.state.morphemeTranscriptions.includes(transc)} onChange={this.handleTranscriptionOptions.bind(this)} name={"morpheme-"+transc} />}
            label={transc}
          />
        ))}
        </FormGroup>
        </div>

        <div className="optionTransl" hidden={this.state.options.morpheme.translations.length===0}>
        <FormLabel component="legend"><Translate text='Morpheme translation'/></FormLabel>
        <FormGroup>
        {this.state.options.morpheme.translations.map(transl => (
          <FormControlLabel key={"morphemeTranslation"+transl}
            control={<Checkbox checked={this.state.morphemeTranslations.includes(transl)} onChange={this.handleTranslationOptions.bind(this)} name={"morpheme-"+transl} />}
            label={transl}
          />
        ))}
        </FormGroup>
        </div>                  

        <div className="optionNotes" hidden={this.state.options.note.translations.length===0}>
          <FormLabel component="legend">Notes</FormLabel>
          <FormGroup>
            {this.state.options.note.translations.map(nl => (
              <FormControlLabel key={"note"+nl}
                control={<Checkbox checked={this.state.displayNotes.includes(nl)} onChange={this.handleNotesOptions.bind(this)} name={nl} />}
                label={nl}
              />
            ))}
          </FormGroup>
        </div>

        <div className="optionContinuousPlay" hidden={this.state.continuousPlay.length===0}>
          <FormLabel component="legend"><Translate text='Continuous play'/></FormLabel>
          <FormGroup>

              <FormControlLabel key={"continuousPlay"}
                control={<Checkbox checked={this.state.continuousPlay===true} onChange={this.handleCheck.bind(this)} name="continuousPlay" />}
                label=""
              />

          </FormGroup>
        </div>

        </FormGroup>

        }

      </div>
    );
  }
}

export default DisplayOptions;