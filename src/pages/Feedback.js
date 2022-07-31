import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { resetGlobalStateAction } from '../redux/action';

class Feedback extends React.Component {
  updateRanking = () => {
    const { userName, score, userEmail } = this.props;
    const urlPicture = `https://www.gravatar.com/avatar/${userEmail}`;
    const currentStore = localStorage.getItem('ranking') || [];
    const arrayCurrentStore = typeof currentStore === 'string'
      ? JSON.parse(currentStore) : [];
    const newStore = [
      ...arrayCurrentStore,
      {
        name: userName,
        score,
        picture: urlPicture,
      },
    ];
    const newStoreString = JSON.stringify(newStore);
    localStorage.setItem('ranking', newStoreString);
  }

  // resetGame = () => {
  //   const { resetGlobalState } = this.props;
  //   resetGlobalState();
  // }

  render() {
    const { userEmail, userName, score, assertions } = this.props;
    const gravatarEmail = md5(userEmail).toString();
    const three = 3;
    return (
      <main>
        <header>
          <img
            alt="Foto de perfil"
            src={ `https://www.gravatar.com/avatar/${gravatarEmail}` }
            data-testid="header-profile-picture"
          />
          <div>
            <span data-testid="header-player-name">{ userName }</span>
            <span data-testid="header-score">{ score }</span>
          </div>
        </header>
        <section>
          <span data-testid="feedback-text">
            { assertions < three ? 'Could be better...' : 'Well Done! ' }
          </span>
          <p data-testid="feedback-total-score">{ score }</p>
          <p data-testid="feedback-total-question">{ assertions }</p>
        </section>
        <Link to="/">
          <button
            type="button"
            data-testid="btn-play-again"
            // onClick={ this.resetGame }
          >
            Play again
          </button>
        </Link>
        <Link to="/ranking">
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ this.updateRanking }
          >
            Ranking
          </button>
        </Link>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.player.gravatarEmail,
  userName: state.player.name,
  score: state.player.score,
  assertions: state.player.assertions,
});

// const mapDispatchToProps = (dispatch) => ({
//   resetGlobalState: () => dispatch(resetGlobalStateAction()),
// });

Feedback.propTypes = {
  userEmail: PropTypes.string,
  userName: PropTypes.string,
  removeUser: PropTypes.func,
}.isRequired;

export default connect(mapStateToProps)(Feedback);
