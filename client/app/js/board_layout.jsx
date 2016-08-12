/*jshint esversion: 6 */
import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MyMenu from './menu';
import Layout from './layout';
import MenuItem from 'material-ui/MenuItem';
import StorySelect from './story_select';
import ColumnDialog from './column_dialog';
import StoryDialog from './story_dialog';
import TaskDialog from './task_dialog';
import Colors from './color';
import BoardStore from './store/BoardStore';
import BoardActions from './actions/BoardActions';

class BoardLayout extends Layout  {
  constructor(props) {
    super(props);
    this.state = this.getDialogState();
  }
  _onChange = () => {
    this.setState(this.getDialogState());
  }

  getDialogState = () => {
    return {
      menu_open: BoardStore.getMenuOpen(),
      column_open: BoardStore.getColumnDialogOpen(),
      story_open: BoardStore.getStoryDialogOpen(),
      task_open: BoardStore.getTaskDialogOpen()
    };
  }

  componentWillUnmount = () => {
    BoardStore.removeChangeListener(this._onChange);
  }

  componentDidMount = () => {
    BoardStore.addChangeListener(this._onChange);
  }

  handleTouchTapMenuBtn = (event) => {
    event.preventDefault();
    this.setState({menu_open: true, menu_achor: event.currentTarget});
  }

  handleTouchTapCloseMenu = () => {
    var achor_element = this.state.menu_achor;
    this.setState({menu_open: false, menu_achor: achor_element});
  }

  handleFilter = (event, index, value) => {
  }

  render() {
    return <div>
      <AppBar
        title={this.props.title}
        iconElementRight={
          <div>
          <StorySelect onChange={this.handleFilter} stories={this.props.stories}
            story_id={0} allow_empty={true} style={{color: "white"}} />
          <FlatButton label="木漏れ日"
            href={"https://github.com/mafigit/Komorebi"}
            style={{verticalAlign: "baseline"}}
            labelStyle={{fontSize: "30px", color: Colors.light_red,
              fontWeight: "bold"}}/>
          </div>
        }
        onLeftIconButtonTouchTap={this.handleTouchTapMenuBtn}
        style={{backgroundColor: Colors.dark_gray}} />
      <MyMenu open={this.state.menu_open} achor={this.state.menu_achor}
        touchAwayHandler={this.handleTouchTapCloseMenu} />
      <ColumnDialog open={this.state.column_open} />
      <StoryDialog open={this.state.story_open} action="edit" />
      <TaskDialog open={this.state.task_open} />
      {this.props.children}
     </div>
  }
}

export default BoardLayout;
