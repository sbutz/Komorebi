/*jshint esversion: 6 */
import React from 'react';
import BoardCanvas from './board_canvas';
import Ajax from 'basic-ajax';
import StoryDialog from './story_dialog';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story_view_open: false,
      story_id: null
    }
  }

  updateStory = (story, column_id) => {
    let data = {
      "id": parseInt(story.id),
      "name": story.name,
      "desc": story.desc,
      "requirements": story.requirements,
      "points": story.points,
      "column_id": parseInt(column_id),
      "priority": 1
    }
    Ajax.postJson('/stories/' + story.id, data).then(response => {
      var response_obj = JSON.parse(response.responseText);
      if (response_obj.success) {
       } else {
       }
    });
  }

  updateTask = (task, column_id) => {
    let data = {
      "id": parseInt(task.id),
      "name": task.name,
      "desc": task.desc,
      "column_id": parseInt(column_id),
      "priority": 1,
      "story_id": task.story_id
    }
    Ajax.postJson('/tasks/' + task.id, data).then(response => {
      var response_obj = JSON.parse(response.responseText);
      if (response_obj.success) {
       } else {
       }
    });
  }

  openStoryView = (story_id) => {
    this.setState({story_view_open: true, story_id: story_id});
  }

  closeStoryView = () => {
    this.setState({story_view_open: false});
  }

  componentDidMount() {
    this.props.getBoard((board) => {
      this.props.boardLoadedHandler(board)
    });
  }

  componentDidUpdate() {
    this.board_canvas =
      new BoardCanvas('board', this.props.columns, this.props.stories,
        this.props.tasks, {story: this.updateStory, task: this.updateTask,
        reload: this.props.boardReloadHandler, open_story_view: this.openStoryView});
  }

  render() {
    return <div>
      <StoryDialog columns={this.props.columns} story_id={this.state.story_id}
        board_id={1} open={this.state.story_view_open}
        handleClose={this.closeStoryView} action="show"/>
      <div id='board'></div>
    </div>
  }
}

export default Board;
