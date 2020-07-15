<<<<<<< HEAD
import React from 'react';
import { FormGroup, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@material-ui/core';
import Annotations from './Annotations';
import Images from './Images';

class Options extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedFile: props.selectedFile,
        checkedTranscriptionBySentence: true,
        checkedTranslationBySentence: true,
        checkedWholeTranscription: false,
        checkedWholeTranslation: false,
        checkedWords : true,
        displayTranscription:[],
        displayTranslation:[]
    };
  }

  updateState(event) {
    this.setState({ selectedFile: event.target.value});
  }

  handleChecked(event){
    //this.setState({checkedTranscriptionBySentence: event.target.checked});
    this.setState({[event.target.name]: event.target.checked});
  }



  render() {
    const menuItems = [];
    this.props.files.forEach((f) => {
      menuItems.push(
          <MenuItem
            key={f.id}
            value={f}>{f.id}</MenuItem>
        );

    });

    if(this.props.files.length == 0){
        menuItems.push(
        <MenuItem
          key={0}
          value={0}>No file available</MenuItem>
      );
    }
      
    

    return (
      <div>
        <h2>Options</h2>
        {
        this.state.selectedFile
        ?
        <FormGroup row>
        
        <FormControl>
          <InputLabel id="annotationFile-select-label">Annotation file</InputLabel>
          <Select
            labelId="annotationFile-select-label"
            id="annotationFile-select"
            value={this.state.selectedFile}
            defaultValue={this.props.selectedFile.id}
            onChange={this.updateState.bind(this)}
          >
            {menuItems}
            
          </Select>
        </FormControl>
        <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedTranscriptionBySentence}
                onChange={this.handleChecked.bind(this)}
                name="checkedTranscriptionBySentence"
                color="primary"
              />
            }
            label="Transcription by sentence"
          />

          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedTranslationBySentence}
                onChange={this.handleChecked.bind(this)}
                name="checkedTranslationBySentence"
                color="primary"
              />
            }
            label="Translation by sentence"
          />

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
                checked={this.state.checkedWords}
                onChange={this.handleChecked.bind(this)}
                name="checkedWords"
                color="primary"
              />
            }
            label="Words"
          />

          </FormGroup>
          :
          <div></div>
          }

          { 
          this.props.images.length > 0
          ?
          <Images images={this.props.images} />
          :
          <div></div>
          }

          { 
          this.state.selectedFile
          ?
          <Annotations displayOptions={this.state} file={this.state.selectedFile} images={this.props.images} />
          :
          <div></div>
          }
      </div>
    );
  }
}

=======
import React from 'react';
import { FormGroup, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@material-ui/core';
import Annotations from './Annotations';
import Images from './Images';

class Options extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedFile: props.selectedFile,
        checkedTranscriptionBySentence: true,
        checkedTranslationBySentence: true,
        checkedWholeTranscription: false,
        checkedWholeTranslation: false,
        checkedWords : true,
        displayTranscription:[],
        displayTranslation:[]
    };
  }

  updateState(event) {
    this.setState({ selectedFile: event.target.value});
  }

  handleChecked(event){
    //this.setState({checkedTranscriptionBySentence: event.target.checked});
    this.setState({[event.target.name]: event.target.checked});
  }



  render() {
    const menuItems = [];
    this.props.files.forEach((f) => {
      menuItems.push(
          <MenuItem
            key={f.id}
            value={f}>{f.id}</MenuItem>
        );

    });

    if(this.props.files.length == 0){
        menuItems.push(
        <MenuItem
          key={0}
          value={0}>No file available</MenuItem>
      );
    }
      
    

    return (
      <div>
        <h2>Options</h2>

        <FormGroup row>
        <FormControl>
          <InputLabel id="annotationFile-select-label">Annotation file</InputLabel>
          <Select
            labelId="annotationFile-select-label"
            id="annotationFile-select"
            value={this.state.selectedFile}
            defaultValue={this.props.selectedFile.id}
            onChange={this.updateState.bind(this)}
          >
            {menuItems}
            
          </Select>
        </FormControl>

        <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedTranscriptionBySentence}
                onChange={this.handleChecked.bind(this)}
                name="checkedTranscriptionBySentence"
                color="primary"
              />
            }
            label="Transcription by sentence"
          />

          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedTranslationBySentence}
                onChange={this.handleChecked.bind(this)}
                name="checkedTranslationBySentence"
                color="primary"
              />
            }
            label="Translation by sentence"
          />

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
                checked={this.state.checkedWords}
                onChange={this.handleChecked.bind(this)}
                name="checkedWords"
                color="primary"
              />
            }
            label="Words"
          />

          </FormGroup>

          <Images images={this.props.images} />
          <Annotations displayOptions={this.state} file={this.state.selectedFile} images={this.props.images} />

      </div>
    );
  }
}

>>>>>>> b41ec341fc1a27e65269b27ad4962fc772dd46d3
export default Options;