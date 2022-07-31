import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const myQuestions = {
  results: [
  {
      "category": "Entertainment: Video Games",
      "type": "multiple",
      "difficulty": "easy",
      "question": "In what year was &quot;Antichamber&quot; released?",
      "correct_answer": "2013",
      "incorrect_answers": [
          "2012",
          "2014",
          "2011"
      ]
  },
  {
      "category": "Entertainment: Video Games",
      "type": "boolean",
      "difficulty": "easy",
      "question": "In Pok&eacute;mon, Bulbasaur is the only starter pokemon that is a Grass/Poison type.",
      "correct_answer": "True",
      "incorrect_answers": [
          "False"
      ]
  },
  {
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "What was the first feature-length computer-animated movie?",
      "correct_answer": "Toy Story",
      "incorrect_answers": [
          "Tron",
          "Lion king",
          "101 Dalmatians"
      ]
  },
  {
      "category": "General Knowledge",
      "type": "multiple",
      "difficulty": "medium",
      "question": "A statue of Charles Darwin sits in what London museum?",
      "correct_answer": "Natural History Museum",
      "incorrect_answers": [
          "Tate",
          "British Museum",
          "Science Museum"
      ]
  },
  {
      "category": "Entertainment: Comics",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What is the real name of the &quot;Master Of Magnetism&quot; Magneto?",
      "correct_answer": "Max Eisenhardt",
      "incorrect_answers": [
          "Charles Xavier",
          "Pietro Maximoff",
          "Johann Schmidt"
      ]
  }
]
}

const MyErrorFetch = {
  response_code: 3,
  results: [],
}

describe('Testa a Página de Game com fetch padrão' , () => {
  beforeEach(() => {
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(myQuestions),
  });
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
    // const { history } = renderWithRouterAndRedux(<App />);
    // history.push('/game');
  });

  it('Testa se informações do usuário são renderizadas', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const playerName = screen.getByTestId('header-player-name');
    const playerImage = screen.getByTestId('header-profile-picture');

    expect(playerName).toBeInTheDocument();
    expect(playerImage).toBeInTheDocument();
    });

  it('Testa se a pontuação é renderizada', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const score = screen.getByTestId('header-score');;

    expect(score).toBeInTheDocument();
  });

  it('Testa se o contador é renderizado', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const counter = screen.getByTestId('counter');

    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent(30);
    await waitFor(() =>  expect(counter).toHaveTextContent(26), { timeout: 5000 })

    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(30000);
    const correctAnswer = await screen.findByTestId('correct-answer');
    const incorrectAnswer = await screen.findByTestId('wrong-answer-0');
    expect(correctAnswer).toBeDisabled();
    expect(incorrectAnswer).toBeDisabled();
   
  });

  it('Testa se infomações das perguntas são renderizadas', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const category= screen.getByTestId('question-category');
    const questions= screen.getByTestId('question-text');

    expect(category).toBeInTheDocument();
    expect(questions).toBeInTheDocument();
  });

  it('Testa se as respostas são renderizadas', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const answers= screen.getByTestId('answer-options');
    expect(answers).toBeInTheDocument();
  });
  
  it('Testa o botão next', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const correctAnswer = await screen.findByTestId('correct-answer');
    userEvent.click(correctAnswer);
    const nextButton = await screen.findByRole('button', {
      name: /Next/i
    });
    expect(nextButton).toBeInTheDocument();
    userEvent.click(nextButton);
    expect(screen.getByText(myQuestions.results[1].question)).toBeInTheDocument();
  });

  it('Testa o score', async () => {
    const initialState = {
      player:
        {
          name: 'nome-da-pessoa',
          assertions: 0,
          score: 0,
          gravatarEmail: 'email-da-pessoa',
        },
    };
    
    const { history, store } = renderWithRouterAndRedux(<App />, initialState);
    history.push('/game');

    const scoreHeader = screen.getByTestId('header-score');
    expect(scoreHeader.innerHTML).toEqual('0');

    const incorrectAnswer = await screen.findByTestId('wrong-answer-0');
    userEvent.click(incorrectAnswer);

    expect(await screen.findByRole('button', {
      name: /Next/i
    })).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    expect(scoreHeader.innerHTML).toEqual('0');
    await waitFor(() => expect(store.getState().player.score).toEqual(0))

    const correctAnswer = await screen.findByTestId('correct-answer');
    userEvent.click(correctAnswer);

    expect(await screen.findByRole('button', {
      name: /Next/i
    })).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    expect(scoreHeader.innerHTML).not.toEqual('0');
    await waitFor(() => expect(store.getState().player.score).not.toEqual('0'))
    
  });

  it('Testa se o botão é desabilitado', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const correctAnswer = await screen.findByTestId('correct-answer');
    const incorrectAnswer = await screen.findByTestId('wrong-answer-0');
    userEvent.click(correctAnswer);
    expect(correctAnswer).toBeDisabled();
    expect(incorrectAnswer).toBeDisabled();
  })

  it('Testa o botão para feedback', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game')
    
    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    expect(screen.getByText(myQuestions.results[1].question)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    expect(screen.getByText(myQuestions.results[2].question)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByRole('button', {
      name: /Next/i
    }));

    await waitFor(() => expect(history.location.pathname).toBe('/feedback'));
  })

});


describe('Testa a Página de Game com fetch error', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MyErrorFetch),
    });
    });
  it('Testa o fetch com erro', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    await waitFor(() =>  expect(history.location.pathname).toBe('/'))
  })
})