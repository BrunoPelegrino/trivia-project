export const SAVE_USER = 'SAVE_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const DISABLE_BUTTONS = 'DISABLE_BUTTONS';
export const UPDATE_SCORE = 'UPDATE_SCORE';
export const UPDATE_ASSERTIONS = 'UPDATE_ASSERTIONS';
// export const RESET_GLOBAL_STATE = 'RESET_GLOBAL_STATE';

export const saveUserAction = ({ userName, email }) => ({
  type: SAVE_USER,
  userName,
  email,
});

export const removeUserAction = () => ({ type: REMOVE_USER });

export const updateScoreAction = (payload) => ({ type: UPDATE_SCORE, payload });

export const updateAssertionsAction = () => ({ type: UPDATE_ASSERTIONS });

// export const resetGlobalStateAction = () => ({ type: RESET_GLOBAL_STATE });
