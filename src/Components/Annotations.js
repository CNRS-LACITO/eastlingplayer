import React from 'react';
import Sentence from './Sentence';
import { Container } from '@material-ui/core';
var test="test";

class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      annotationData: [],
      wholeTranscription: [],
      wholeTranslation: []
    };
  }



  getAnnotationData(){
    if(this.props.file.data){
      console.log("data");
      this.setState({
            isLoaded: true,
            annotationData : this.props.file.data.TEXT.S
          });

      console.log(this.state.annotationData);
    }else{
      console.log("url");
      fetch(this.props.file.url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            annotationData : result.TEXT.S
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
    var imageSrc = "";
    var sID = 0;

    this.state.annotationData.forEach((a) => {

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
      annotationItems.push(
          <Sentence sID={sID} s={a} imageSrc={imageSrc} displayOptions={this.props.displayOptions} />
        );
    });

    return (
      <div>
        <Container fixed>
              {annotationItems}
        </Container>
      </div>
    );
  }
}

export default Annotations;