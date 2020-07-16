import React from 'react';


class Player extends React.Component {

  constructor(props) {
    super(props);
  }


  componentDidMount() {

    const s = document.createElement('script');
     
    s.type = 'text/javascript';
    s.async = true;

    var scriptStr = "var wordidList=[];var startTimeList=[];var endTimeList=[];"
    scriptStr +="function updatePosition(time){startTimeList.some(function(t,index,_arr){ if(t < time && endTimeList[index]> time){highlight(wordidList[index]);} })}";
    scriptStr +="document.getElementById('player').ontimeupdate=function(){updatePosition(this.currentTime)};";
    scriptStr +="function highlight(id){document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement.scrollIntoView();window.scrollBy(0, -50);document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement.scrollLeft=document.querySelector('[wordid=\"'+id+'\"]').offsetLeft;document.querySelector('[wordid=\"'+id+'\"]').style.border='solid';";
    scriptStr +="document.querySelectorAll('canvas:not([wordid=\"'+id+'\"])').forEach(function(e){e.style.border='none'});}";
    //document.querySelector('[wordid=\"'+id+'\"]').parentElement.parentElement
    //console.log(scriptStr);

    s.innerHTML = scriptStr;

    this.instance.appendChild(s);

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
        Your browser does not support the
            <code>audio</code> element.</audio>;
    }else{
      mediaElement = <video ref={video => (this.video = video)} id="player" controls preload='auto' style={audioStyle}>
          <source src={this.props.file.url} type="video/mp4" />
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