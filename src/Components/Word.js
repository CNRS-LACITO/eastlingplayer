<<<<<<< HEAD
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Popover, Typography} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class Word extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      anchorEl: null,
        open: false
	    };
	  }

    componentDidMount() {
      if(this.props.w.AUDIO != undefined){
        const s = document.createElement('script'); 
        s.type = 'text/javascript';
        s.async = true;

        var scriptStr = "wordidList.push('"+this.props.w.id+"');";
        scriptStr += "startTimeList.push("+this.props.w.AUDIO.start+");"
        scriptStr += "endTimeList.push("+this.props.w.AUDIO.end+");"


        s.innerHTML = scriptStr;

        this.instance.appendChild(s);
      }
      
    }

  handleClick = (event) => {
    //console.log(event.currentTarget);
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });

    if(event.currentTarget.id.length>0){
      document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
      document.querySelector('[wordid="'+event.currentTarget.id+'"]').style.border='solid';
    }
      };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    });
    document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
  };

  render() {

    const buttonStyle = {
      'text-transform': 'lowercase'
    }

  	let word = "";
    const transcriptions = [];
  	const translations = [];
    const notes = [];


    //cas où une seule balise FORM est trouvé=>converti en objet et pas en tableau
    if(this.props.w.TRANSL.length == undefined){
      translations.push(
              <Typography variant="body2" component="p">
                {this.props.w.TRANSL["xml:lang"]}: {this.props.w.TRANSL.text}
              </Typography>
            );
    }else{
      this.props.w.TRANSL.forEach((t) => {
          translations.push(
              <Typography variant="body2" component="p">
                {t["xml:lang"]}: {t.text}
              </Typography>
            );
        });
    }
  //
      if(this.props.w.FORM.length == undefined){
        transcriptions.push(
                  <Typography variant="body2" component="p">
                    {this.props.w.FORM.kindOf}: {this.props.w.FORM.text}
                  </Typography>
                );
                word = this.props.w.FORM.text;
        }else{
          this.props.w.FORM.forEach((f) => {
              transcriptions.push(
                  <Typography variant="body2" component="p">
                    {f.kindOf}: {f.text}
                  </Typography>
                );
            });
            word = this.props.w.FORM[0].text;
        }

        // Get note(s) of the sentence
  if(this.props.w.NOTE != undefined){
    if(this.props.w.NOTE.length == undefined){
      notes.push(
              <Typography variant="body2" component="p">
                {this.props.w.NOTE["xml:lang"]}: <b>{this.props.w.NOTE.message}</b> <b>{this.props.w.NOTE.text}</b>
              </Typography>
            );
    }else{
      this.props.w.NOTE.forEach((f) => {
          notes.push(
              <Typography variant="body2" component="p">
                {f["xml:lang"]}: <b>{f.message}</b> <b>{f.text}</b>
              </Typography>
            );
        });
    }
  }

    return (
      <div style={{display:"inline-block"}} ref={el => (this.instance = el)} >
        <Button style={buttonStyle} id={this.props.w.id} aria-describedby={this.props.w.id} variant="contained" color="default" onClick={this.handleClick}>
          {word}
        </Button>
        <Popover
          id={this.props.w.id}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
            <p>
            {transcriptions}
            </p>

            <p>
            {translations}
            </p>

            <p>
            {notes}
            </p>
          
        </Popover>
        </div>
    );
  }
}

=======
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Popover, Typography} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class Word extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      anchorEl: null,
        open: false
	    };
	  }

    componentDidMount() {
      if(this.props.w.AUDIO != undefined){
        const s = document.createElement('script'); 
        s.type = 'text/javascript';
        s.async = true;

        var scriptStr = "wordidList.push('"+this.props.w.id+"');";
        scriptStr += "startTimeList.push("+this.props.w.AUDIO.start+");"
        scriptStr += "endTimeList.push("+this.props.w.AUDIO.end+");"


        s.innerHTML = scriptStr;

        this.instance.appendChild(s);
      }
      
    }

  handleClick = (event) => {
    //console.log(event.currentTarget);
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });

    if(event.currentTarget.id.length>0){
      document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
      document.querySelector('[wordid="'+event.currentTarget.id+'"]').style.border='solid';
    }
      };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    });
    document.querySelectorAll('canvas').forEach((c)=>c.style.border="none");
  };

  render() {

    const buttonStyle = {
      'text-transform': 'lowercase'
    }

  	let word = "";
    const transcriptions = [];
  	const translations = [];
    const notes = [];


    //cas où une seule balise FORM est trouvé=>converti en objet et pas en tableau
    if(this.props.w.TRANSL.length == undefined){
      translations.push(
              <Typography variant="body2" component="p">
                {this.props.w.TRANSL["xml:lang"]}: {this.props.w.TRANSL.text}
              </Typography>
            );
    }else{
      this.props.w.TRANSL.forEach((t) => {
          translations.push(
              <Typography variant="body2" component="p">
                {t["xml:lang"]}: {t.text}
              </Typography>
            );
        });
    }
  //
      if(this.props.w.FORM.length == undefined){
        transcriptions.push(
                  <Typography variant="body2" component="p">
                    {this.props.w.FORM.kindOf}: {this.props.w.FORM.text}
                  </Typography>
                );
                word = this.props.w.FORM.text;
        }else{
          this.props.w.FORM.forEach((f) => {
              transcriptions.push(
                  <Typography variant="body2" component="p">
                    {f.kindOf}: {f.text}
                  </Typography>
                );
            });
            word = this.props.w.FORM[0].text;
        }

        // Get note(s) of the sentence
  if(this.props.w.NOTE != undefined){
    if(this.props.w.NOTE.length == undefined){
      notes.push(
              <Typography variant="body2" component="p">
                {this.props.w.NOTE["xml:lang"]}: <b>{this.props.w.NOTE.message}</b> <b>{this.props.w.NOTE.text}</b>
              </Typography>
            );
    }else{
      this.props.w.NOTE.forEach((f) => {
          notes.push(
              <Typography variant="body2" component="p">
                {f["xml:lang"]}: <b>{f.message}</b> <b>{f.text}</b>
              </Typography>
            );
        });
    }
  }

    return (
      <div style={{display:"inline-block"}} ref={el => (this.instance = el)} >
        <Button style={buttonStyle} id={this.props.w.id} aria-describedby={this.props.w.id} variant="contained" color="default" onClick={this.handleClick}>
          {word}
        </Button>
        <Popover
          id={this.props.w.id}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
            <p>
            {transcriptions}
            </p>

            <p>
            {translations}
            </p>

            <p>
            {notes}
            </p>
          
        </Popover>
        </div>
    );
  }
}

>>>>>>> b41ec341fc1a27e65269b27ad4962fc772dd46d3
export default Word;