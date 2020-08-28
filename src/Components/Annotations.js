import React from 'react';
import Sentence from './Sentence';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
var test="test";

class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      annotationData: [],
      displayOptions: this.props.displayOptions
    };
  }



  getAnnotationData(){
    if(this.props.annotations){
      this.setState({
            isLoaded: true,
            annotationData : this.props.annotations.TEXT.S
          });
    }
  
  }

  componentDidMount() {
    if(this.props.file !== undefined)
    this.getAnnotationData();
  }

  componentDidUpdate(prevProps, prevState) {
  if (prevProps.file !== this.props.file) {
    this.getAnnotationData();
  }

}


  render() {

    var annotationItems = [];
    var wholeTranscriptions = [];
    var wholeTranslations = [];

    var imageSrc = "";
    var doi = this.props.doi;
    var doiUrl = "https://pangloss.cnrs.fr/corpus/citation_doi.php?";
    var sID = 0;

    //this.state.annotationData.forEach((a) => {
    this.props.annotations.S.forEach((a) => {
      if(a.AREA != undefined && a.AREA.image != undefined){
        this.props.images.forEach((i) =>{
          var idImage = i.id.split('.version');

          if(idImage[0]==a.AREA.image)
            {
              imageSrc=i.url;
            }
        });
      }
      
      sID++;
      var doiSentenceUrl = doiUrl + doi + "&sentence=S" + sID;

      annotationItems.push(
          <Sentence doi={doiSentenceUrl} sID={sID} s={a} imageSrc={imageSrc} displayOptions={this.state.displayOptions} />
        );
    });

    // Get whole transcription(s) of the doc
    if(this.props.annotations.FORM != undefined){
      if(this.props.annotations.FORM.length == undefined){
        wholeTranscriptions.push(
                <Typography hidden={!this.props.displayOptions.wholeTranscriptions} variant="body2" component="p" className="wholeTranscriptions">
                  {this.props.annotations.FORM.text}
                </Typography>
              );
      }else{
        this.props.annotations.FORM.forEach((f) => {
            wholeTranscriptions.push(
                <Typography hidden={!this.props.displayOptions.wholeTranscriptions} variant="body2" component="p" className="wholeTranscriptions">
                  {f.text}
                </Typography>
              );
          });
      }
    }
//
    // Get whole translation(s) of the doc
    if(this.props.annotations.TRANSL != undefined){
      if(this.props.annotations.TRANSL.length == undefined){
        wholeTranslations.push(
                <Typography hidden={!this.props.displayOptions.wholeTranslations.includes(this.props.annotations.TRANSL["xml:lang"])} variant="body2" component="p" className={`wholetranslation ${this.props.s.TRANSL['xml:lang']}`}>
                  {this.props.annotations.FORM.text}
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

    return (
      <div>
        <Container fixed>
               {wholeTranscriptions}
        </Container>
        <Container fixed>
               {wholeTranslations}
        </Container>
        <Container fixed>
              {annotationItems}
        </Container>
      </div>
    );
  }
}

export default Annotations;