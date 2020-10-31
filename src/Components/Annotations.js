import React from 'react';
import Sentence from './Sentence';
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


/*

DEPRECATED : plus de choix de fichier annotations en liste déroulante

  getAnnotationData(){
    if(this.props.annotations){
      this.setState({
            isLoaded: true,
            annotationData : this.props.annotations.TEXT.S
          });
    }
  }

 componentDidMount() {
    if(this.props.file !=== undefined)
    this.getAnnotationData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.file !=== this.props.file) {
      this.getAnnotationData();
    }

  }
*/

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
      console.log("track creation");
      
      //var trackTranscription = player.addTextTrack("subtitles","transcription");
      //var trackTranslation = player.addTextTrack("subtitles","translation");
      
    }

    //this.state.annotationData.forEach((a) => {
    this.props.annotations.S.forEach((a) => {

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
      var doiSentenceUrl = doiUrl + doi + "&sentence=S" + sID;
      //TEST VTT
 
      if(trackTranscription.cues.length < this.props.annotations.S.length){
        
        var transcSubtitle = "";
        var translSubtitle = "";

        if(typeof(a.FORM) === "object"){
          transcSubtitle = a.FORM.text;
        }else{
          transcSubtitle = a.FORM[0].text;
        }

        if(a.TRANSL !== null){
          if(typeof(a.TRANSL) === "object"){
            translSubtitle = a.TRANSL.text;
          }else{
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

    // Get whole transcription(s) of the doc
    if(this.props.annotations.FORM !== undefined){
      if(this.props.annotations.FORM.length === undefined){
        wholeTranscriptions.push(
                <Typography hidden={(!this.props.displayOptions.wholeTranscriptions) || (!this.props.displayOptions.transcriptions.includes(this.props.annotations.FORM.kindOf))} variant="body2" component="p" className={this.props.annotations.FORM.kindOf + " wholeTranscriptions"}>
                  {this.props.annotations.FORM.text}
                </Typography>
              );
      }else{
        this.props.annotations.FORM.forEach((f) => {
            wholeTranscriptions.push(
                <Typography hidden={(!this.props.displayOptions.wholeTranscriptions) || (!this.props.displayOptions.transcriptions.includes(f.kindOf))} variant="body2" component="p" className={f.kindOf + " wholeTranscriptions"}>
                  {f.text}
                </Typography>
              );
          });
      }
    }
//
    // Get whole translation(s) of the doc
    if(this.props.annotations.TRANSL !== null && this.props.annotations.TRANSL !== undefined){
      if(this.props.annotations.TRANSL.length === undefined){
        wholeTranslations.push(
                <Typography hidden={!this.props.displayOptions.wholeTranslations.includes(this.props.annotations.TRANSL["xml:lang"])} variant="body2" component="p" className={`wholetranslation ${this.props.annotations.TRANSL['xml:lang']}`}>
                  {this.props.annotations.TRANSL.text}
                </Typography>
              );
      }else{
        this.props.annotations.TRANSL.forEach((t) => {
            wholeTranslations.push(
                <Typography hidden={!this.props.displayOptions.wholeTranslations.includes(t["xml:lang"])} variant="body2" component="p" className={`wholetranslation ${t['xml:lang']}`}>
                  {t.text}
                </Typography>
              );
          });
      }
    }

    // Get note(s) of the doc
    if(this.props.annotations.NOTE !== undefined && this.props.annotations.NOTE !== null){
      if(this.props.annotations.NOTE.length === undefined){
        notes.push(
                <Typography hidden={!this.props.displayOptions.notes.includes(this.props.annotations.NOTE["xml:lang"])} variant="body2" component="p" className={`note ${this.props.annotations.NOTE['xml:lang']}`}>
                  {this.props.annotations.NOTE.message}
                </Typography>
              );
      }else{
        this.props.annotations.NOTE.forEach((t) => {
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
        <Container fixed>
               {wholeTranscriptions}
        </Container>
        <Container fixed>
               {wholeTranslations}
        </Container>
        <Container fixed>
               {notes}
        </Container>
        <Container fixed>
              {annotationItems}
        </Container>
      </div>
    );
  }
}

export default Annotations;