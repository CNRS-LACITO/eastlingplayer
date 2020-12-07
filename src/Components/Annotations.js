import React from 'react';
import Sentence from './Sentence';
import Word from './Word';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      annotationData: [],
      displayOptions: this.props.displayOptions
    };
  }

  shouldComponentUpdate() {
    console.log('Annotations - shouldComponentUpdate lifecycle');
    return false;
  }

  render() {
    console.log(this.state.isLoaded);

    var annotationItems = [];
    var wholeTranscriptions = [];
    var wholeTranslations = [];
    var notes = [];

    var imageSrc = "";
    var doi = this.props.doi;
    var doiUrl = "https://pangloss.cnrs.fr/corpus/citation_doi.php?";
    var sID = 0;

    var player = document.querySelector('#player');
    var trackTest = player.textTracks.getTrackById('test');
    var trackTranscription = player.textTracks.getTrackById('trackTranscription');
    var trackTranslation = player.textTracks.getTrackById('trackTranslation');
    
    trackTest.mode="showing";
    trackTranscription.mode="showing";
    trackTranslation.mode="showing";
    

    if(player.textTracks.length === 1){     
      //var trackTranscription = player.addTextTrack("subtitles","transcription");
      //var trackTranslation = player.addTextTrack("subtitles","translation");
      
    }

    if(this.props.annotations.TEXT !== undefined && this.props.annotations.TEXT !== null)
      var sentences = this.props.annotations.TEXT.S;

    if(this.props.annotations.WORDLIST !== undefined && this.props.annotations.WORDLIST !== null)
      var wordlist = this.props.annotations.WORDLIST.W;

    //this.state.annotationData.forEach((a) => {
    if(sentences !== null && sentences !== undefined){
      sentences.forEach((a) => {

        if(a.AREA !== undefined && a.AREA.image !== undefined){
          this.props.images.forEach((i) =>{
            var idImage = i.id.split('.version');

            if(idImage[0] === a.AREA.image)
              {
                imageSrc=i.url;
              }
          });
        }
        
        sID++;
        //#3
        //var doiSentenceUrl = doiUrl + doi + "&sentence=S" + sID;
        var doiSentenceUrl = doi + "#S" + sID;
        //TEST VTT
   
        if(trackTranscription.cues.length < sentences.length){
          
          var transcSubtitle = "";
          var translSubtitle = "";

          if(typeof(a.FORM) === "object"){
            if(a.FORM !== null)
            transcSubtitle = a.FORM.text;
          }else{
            if(a.FORM[0].text !== null)
            transcSubtitle = a.FORM[0].text;
          }

          if(a.TRANSL !== null){
            if(typeof(a.TRANSL) === "object"){
              if(a.TRANSL !== null)
              translSubtitle = a.TRANSL.text;
            }else{
              if(a.TRANSL[0].text !== null)
              translSubtitle = a.TRANSL[0].text;
            }
          }

          const cueTransc = new VTTCue(a.AUDIO.start, a.AUDIO.end, transcSubtitle);
          const cueTransl = new VTTCue(a.AUDIO.start, a.AUDIO.end, translSubtitle);

          cueTransc.size = 99;
          cueTransl.size = 99;
          cueTransc.line = 12;
          cueTransl.line = 14;

          trackTest.addCue(cueTransc);
          trackTest.addCue(cueTransl);
          trackTranscription.addCue(cueTransc);
          trackTranslation.addCue(cueTransl);
          
        }
        
        annotationItems.push(
            <Sentence doi={doiSentenceUrl} sID={sID} s={a} imageSrc={imageSrc} displayOptions={this.state.displayOptions} />
          );

      });
    }

    if(wordlist !== null && wordlist !== undefined){
      //wordlist.forEach((a) => {

          // Get word(s) of the sentence
        //if(wordlist !== undefined && wordlist !== null){

          //W can be an array or an object depending on the number of children in the XML
          //Object if only one Word, Array if more than 1 word

          if(Array.isArray(wordlist)){
            //get words of the sentence
              wordlist.forEach((w) => {

                if(w.M !== undefined && w.M !== null){

                  if(w.M.length>0){
                    w.M.forEach((m) =>{
                      annotationItems.push(
                            <Word w={m} wID={++sID} displayOptions={this.props.displayOptions} isWordList={true} isMorph={true} />
                        );
                    });
                  }else{
                    annotationItems.push(
                            <Word w={w.M} wID={++sID} displayOptions={this.props.displayOptions} isWordList={true} isMorph={true} />
                        );
                  }


                }else{
                  annotationItems.push(
                    <Word w={w} wID={++sID} displayOptions={this.props.displayOptions} isWordList={true} />
                  );
                } 
                
              });

          } 
          
        //}
      //});
    }
    

    // Get whole transcription(s) of the doc
    if(this.props.annotations.TEXT.FORM !== undefined && this.props.annotations.TEXT.FORM !== null){
      if(this.props.annotations.TEXT.FORM.length === undefined){
        wholeTranscriptions.push(
                <Typography hidden={(!this.props.displayOptions.textTranscriptions) || (!this.props.displayOptions.textTranscriptions.includes(this.props.annotations.TEXT.FORM.kindOf))} variant="body2" component="p" className={"text"+this.props.annotations.TEXT.FORM.kindOf + " transcription"}>
                  {this.props.annotations.TEXT.FORM.text}
                </Typography>
              );
      }else{
        this.props.annotations.TEXT.FORM.forEach((f) => {
            wholeTranscriptions.push(
                <Typography hidden={(!this.props.displayOptions.textTranscriptions) || (!this.props.displayOptions.textTranscriptions.includes(f.kindOf))} variant="body2" component="p" className={"text-" + f.kindOf + " transcription"}>
                  {f.text}
                </Typography>
              );
          });
      }
    }
//
    // Get whole translation(s) of the doc
    if(this.props.annotations.TEXT.TRANSL !== null && this.props.annotations.TEXT.TRANSL !== undefined){
      if(this.props.annotations.TEXT.TRANSL.length === undefined){

        wholeTranslations.push(
                <Typography hidden={!this.props.displayOptions.textTranslations.includes(this.props.annotations.TEXT.TRANSL["xml:lang"])} variant="body2" component="p" className={`translation text-${this.props.annotations.TEXT.TRANSL['xml:lang']}`}>
                  {this.props.annotations.TEXT.TRANSL.text}
                </Typography>
              );
      }else{
        this.props.annotations.TEXT.TRANSL.forEach((t) => {
            wholeTranslations.push(
                <Typography hidden={!this.props.displayOptions.textTranslations.includes(t["xml:lang"])} variant="body2" component="p" className={`translation text-${t['xml:lang']}`}>
                  {t.text}
                </Typography>
              );
          });
      }
    }

    // Get note(s) of the doc
    if(this.props.annotations.TEXT.NOTE !== undefined && this.props.annotations.TEXT.NOTE !== null){
      if(this.props.annotations.TEXT.NOTE.length === undefined){
        notes.push(
                <Typography hidden={!this.props.displayOptions.notes.includes(this.props.annotations.TEXT.NOTE["xml:lang"])} variant="body2" component="p" className={`note ${this.props.annotations.TEXT.NOTE['xml:lang']}`}>
                  {this.props.annotations.TEXT.NOTE.message}
                </Typography>
              );
      }else{
        this.props.annotations.TEXT.NOTE.forEach((t) => {
            notes.push(
                <Typography hidden={!this.props.displayOptions.notes.includes(t["xml:lang"])} variant="body2" component="p" className={`note ${t['xml:lang']}`}>
                  {t.message}
                </Typography>
              );
          });
      }
    }

//

    return (
      <div>
        <div class="TEXT">
          <Container fixed id="documentTranscriptionsBlock">
                 {wholeTranscriptions}
          </Container>
          <Container fixed id="documentTranslationsBlock">
                 {wholeTranslations}
          </Container>
          <Container fixed id="documentNotesBlock">
                 {notes}
          </Container>
        </div>
        <Container fixed id="documentAnnotationsBlock">
              {annotationItems}
        </Container>
      </div>
    );
  }
}

export default Annotations;