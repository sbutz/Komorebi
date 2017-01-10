/*jshint esversion: 6 */
import AppDispatcher from '../dispatcher/AppDispatcher';
var ErrorActions = {
  addBoardErrors: (errors) => {
    AppDispatcher.dispatch({
      actionType: "ADD_BOARD_ERRORS",
      errors: errors
    });
  },
  removeBoardErrors: () => {
    AppDispatcher.dispatch({
      actionType: "REMOVE_BOARD_ERRORS"
    });
  },
  addColumnErrors: (errors) => {
    AppDispatcher.dispatch({
      actionType: "ADD_COLUMN_ERRORS",
      errors: errors
    });
  },
  removeColumnErrors: () => {
    AppDispatcher.dispatch({
      actionType: "REMOVE_COLUMN_ERRORS"
    });
  }
};
module.exports = ErrorActions;