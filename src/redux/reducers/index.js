import {
  SAVE_USER, REMOVE_USER, UPDATE_SCORE, UPDATE_ASSERTIONS,
} from '../action';

const initialState = {
  player:
    {
      name: 'nome-da-pessoa',
      assertions: 0,
      score: 0,
      gravatarEmail: 'email-da-pessoa',
    },
};

function reducer(state = initialState, action) {
  switch (action.type) {
  case (SAVE_USER):
    return ({ ...state,
      player: { ...state.player,
        name: action.userName,
        gravatarEmail: action.email,
        score: 0,
      },
    });
  case (REMOVE_USER):
    return initialState;
  case UPDATE_SCORE:
    return ({
      ...state,
      player: { ...state.player,
        score: action.payload,
      },
    });
  case UPDATE_ASSERTIONS:
    return ({
      ...state,
      player: {
        ...state.player,
        assertions: state.player.assertions + 1,
      },
    });
  // case RESET_GLOBAL_STATE:
  //   return initialState;
  default:
    return state;
  }
}

export default reducer;
