import React from 'react';


class Player extends React.Component {

  constructor(props) {
    super(props);
  }

    componentDidMount() {

    const s = document.createElement('script');
    
    s.type = 'text/javascript';

    var scriptStr = "var wordidList=[];var startTimeList=[];var endTimeList=[];var timeList=[];"
    //scriptStr +="function updatePosition(time){startTimeList.some(function(t,index,_arr){ if(t < time && endTimeList[index]> time){highlight(wordidList[index]);} })}";
    //scriptStr +="function updatePosition(time){timeList.some(function(t,index,_arr){ if(t.start < time && t.end> time){console.log(t);highlight(t.mID ?? t.wID ?? t.sID);} })}";
    scriptStr +="document.getElementById('player').ontimeupdate=function(){updatePosition(this.currentTime)};";
    //scriptStr +="function highlight(id){document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement.scrollIntoView();window.scrollBy(0, -50);document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement.scrollLeft=document.querySelector('[wordid=\"'+id+'\"]').offsetLeft;document.querySelector('[wordid=\"'+id+'\"]').style.border='solid';";
    scriptStr +="function highlight(id){console.log(id);document.querySelector('[wordid=\"'+id+'\"]').scrollIntoView();window.scrollBy(0, 300);/*document.querySelector('[wordid=\"'+id+'\"]').style.border='solid';*/";
    scriptStr +="document.querySelectorAll('canvas:not([wordid=\"'+id+'\"])').forEach(function(e){e.style.border='none'});}";
    //document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement

    s.innerHTML = scriptStr;
    this.instance.appendChild(s);

    window.highlight=function highlight(id,timeVar){
      
      if(timeVar.type!=="S"){
        document.querySelectorAll('canvas:not([wordid=""]').forEach(e => { 
                  e.style.border='none'; 
                });
        document.querySelector('[wordid=\"'+id+'\"]').style.border='solid';
      }

    };

    window.updatePosition=function updatePosition(time){
      window.timeList.some(function(t,index,_arr){ 
        if(t.start < time && t.end> time){

          window.highlight(t.morpheme ?? t.word ?? t.sentence,t);

          if(window.currentSentence !== t.sentence){ 
            window.currentSentence = t.sentence;
            let event = new Event("sentence-changed");
            document.dispatchEvent(event);
            document.querySelector('.SENTENCE#'+t.sentence).scrollIntoView();
            window.scrollBy(0, -150);
          }
          
        } 
      }
    )};

  }

  render() {
    const audioStyle = {
          //'position': 'fixed',
          'width': '80%',
          /*
          'top' : '10px',
          'left' : '10px'*/
        };
    var mediaElement;

    if(this.props.file.type == "audio"){
      mediaElement = <audio ref={audio => (this.audio = audio)} id="player" controls preload='auto' style={audioStyle}>
          <source src={this.props.file.url} type="audio/mpeg" />
          <track label="Transcription & Translation" id="test" />
          <track label="Transcription" id="trackTranscription" />
          <track label="Translation" id="trackTranslation" />
          

        Your browser does not support the
            <code>audio</code> element.</audio>;
    }else{
      mediaElement = <video ref={video => (this.video = video)} id="player" controls preload='auto' style={audioStyle}>
          <source src={this.props.file.url} type="video/mp4" />
          <track label="Transcription & Translation" id="test" />
          <track label="Transcription" id="trackTranscription" />
          <track label="Translation" id="trackTranslation" />
          
           
        Your browser does not support the
            <code>video</code> element.</video>;
    }
    return (
      <div ref={el => (this.instance = el)}>
        {mediaElement}
      </div>
        
    );
  }
}


export default Player;