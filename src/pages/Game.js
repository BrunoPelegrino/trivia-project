import React from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  removeUserAction,
  updateScoreAction,
  updateAssertionsAction } from '../redux/action';

class Game extends React.Component {
  state = {
    counter: 30,
    questions: [{
      question: '',
      incorrect_answers: [],
      correct_answer: '',
      category: '',
    }],
    questionNumber: 0,
    hasAnswer: false,
    disableButtons: false,
    randomAnswers: [],
  }

  async componentDidMount() {
    const { history, removeUser } = this.props;
    const errorCode = 3;
    const userToken = localStorage.getItem('token');
    const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${userToken}`);
    const data = await response.json();
    if (data.response_code === errorCode) {
      localStorage.removeItem('token');
      removeUser();
      history.push('/');
    }
    this.setState({
      questions: data.results,
      randomAnswers: data.results.map((question) => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        const randomAnswer = answers.sort(() => (Math.random() * 2 - 1));
        return randomAnswer;
      }),
    });
    this.counterFunction();
  }

  disableButton = () => {
    this.setState({
      disableButtons: true,
      hasAnswer: true,
    });
  }

  counterFunction = () => {
    const oneSecond = 1000;
    this.myInterval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.counter > 0) {
          return ({
            ...prevState,
            counter: prevState.counter - 1,
          });
        }
        return this.disableButton();
      });
    }, oneSecond);
  }

  updateScoreFunction = (difficulty, correctAnswer, answer) => {
    const { counter } = this.state;
    const { score, updateScore, updateAssertions } = this.props;
    const ten = 10;
    const newScore = score + ten + (difficulty * counter);

    if (answer === correctAnswer) {
      updateScore(newScore);
      updateAssertions();
    }
  }

  handleClick = (answer, question) => {
    const { difficulty, correct_answer: correctAnswer } = question;
    const difficulties = { hard: 3, medium: 2, easy: 1 };
    this.setState({
      hasAnswer: true,
      counter: 0,
      disableButtons: true,
    });
    this.updateScoreFunction(difficulties[difficulty], correctAnswer, answer);
  }

  nextQuestion = () => {
    const maxLength = 4;
    const { history } = this.props;
    const { questionNumber } = this.state;
    if (questionNumber < maxLength) {
      this.setState((prevState) => ({
        ...prevState,
        questionNumber: prevState.questionNumber + 1,
        counter: 30,
        hasAnswer: false,
        disableButtons: false,
      }));
    } else {
      history.push('/feedback');
    }
  }

  render() {
    const { userEmail, userName, score } = this.props;
    const {
      counter,
      questions,
      questionNumber,
      hasAnswer,
      disableButtons,
      randomAnswers } = this.state;
    const gravatarEmail = md5(userEmail).toString();
    return (
      <div>
        <header>
          <img
            alt="Foto de perfil"
            src={ `https://www.gravatar.com/avatar/${gravatarEmail}` }
            data-testid="header-profile-picture"
          />
          <span data-testid="header-player-name">{ userName }</span>
          <span data-testid="header-score">{ score }</span>
          <span data-testid="counter">{counter}</span>
        </header>
        <section>
          <span
            data-testid="question-category"
          >
            {
              questions[questionNumber].category
            }
          </span>
          <span
            data-testid="question-text"
          >
            {
              questions[questionNumber].question
            }
          </span>
          <div data-testid="answer-options">
            {
              randomAnswers.length !== 0 && randomAnswers[questionNumber]
                .map((answer, index) => (
                  <button
                    style={ hasAnswer
                      ? { border: (answer === questions[questionNumber].correct_answer)
                        ? '3px solid rgb(6, 240, 15)' : '3px solid red' } : {} }
                    onClick={ () => this.handleClick(answer, questions[questionNumber]) }
                    type="button"
                    disabled={ disableButtons === true }
                    key={ index }
                    data-testid={
                      answer === questions[questionNumber].correct_answer
                        ? 'correct-answer'
                        : `wrong-answer-${questions[questionNumber].incorrect_answers
                          .indexOf(answer)}`
                    }
                  >
                    { answer }
                  </button>
                ))
            }
          </div>
          { hasAnswer === true
          && (
            <button
              data-testid="btn-next"
              type="button"
              onClick={ this.nextQuestion }
            >
              Next
            </button>
          )}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.player.gravatarEmail,
  userName: state.player.name,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  removeUser: () => dispatch(removeUserAction()),
  updateScore: (score) => dispatch(updateScoreAction(score)),
  updateAssertions: () => dispatch(updateAssertionsAction()),
});

Game.propTypes = {
  userEmail: PropTypes.string,
  userName: PropTypes.string,
  removeUser: PropTypes.func,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Game);

// QUESTIONS OU DATA.RESULTS
// 0: {category: 'Entertainment: Video Games', type: 'multiple', difficulty: 'easy', question: 'What is the name of &quot;Team Fortress 2&quot; update, in which it became Free-to-play?', correct_answer: '&Uuml;ber Update', …}
// 1: {category: 'History', type: 'multiple', difficulty: 'medium', question: 'Joseph Stalin had a criminal past doing what?', correct_answer: 'Robbing Trains', …}
// 2: {category: 'Entertainment: Television', type: 'multiple', difficulty: 'easy', question: 'What is the name of the main character in &quot;The Flash&quot; TV series?', correct_answer: 'Barry Allen', …}
// 3: {category: 'Entertainment: Television', type: 'multiple', difficulty: 'medium', question: 'In the television show &quot;Lazy Town&quot;, who is the actor of Robbie Rotten?', correct_answer: 'Stef&aacute;n Stef&aacute;nsson', …}
// 4: {category: 'Entertainment: Video Games', type: 'multiple', difficulty: 'easy', question: 'In the Halo series, which era of SPARTAN is Master Chief? ', correct_answer: 'SPARTAN-II', …}
// length: 5

// O BOTÃO DEVE AUMENTAR O ESTADO +1
