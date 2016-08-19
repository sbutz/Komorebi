import React from 'react';
import ReactDOM from 'react-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import BoardStore from './store/BoardStore';

export default class StorySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state={select_value: this.props.story_id};
  }

  handleStoryChange= (event, index, value) => {
    this.setState({select_value: value});
    if (this.props.onChange) {
      this.props.onChange(event, index, value);
    }
  }
  menuItems = () => {
    var stories = BoardStore.getStories().slice();
    if (this.props.allow_empty) {
      stories.unshift({id: -1, name: "all"});
    }
    return stories.map((story, key) => {
      return <MenuItem key={key} value={story.id} primaryText={story.name} />}
    )
  }

  render() {
    return <SelectField value={this.state.select_value}
      onChange={this.handleStoryChange} floatingLabelStyle={this.props.style}>
      {this.menuItems()}
    </SelectField>
  }
}

export default StorySelect;