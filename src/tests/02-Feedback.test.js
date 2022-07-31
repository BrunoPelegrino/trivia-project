import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Testa a Página de Feedback' , () => {
  beforeEach(() => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
  });
  it('Testa o campo de nome', () => {
    const playerName = screen.getByText(/Nome/i);
    expect(playerName).toBeInTheDocument();
  });

  it('Testa o campo de feedback', () => {
    const feedback = screen.getByTestId('feedback-text');
    expect(feedback).toBeInTheDocument();
  });

  it('Testa se a imagem do avatar aparece na tela', () => {
    const image = screen.getByTestId('header-profile-picture');
    expect(image).toBeInTheDocument();
  });

  it('Testa se a pontuação aparece na tela', () => {
    const score = screen.getByTestId('header-score');
    expect(score).toBeInTheDocument();
  });

  it('Testa se o número de acertos aparece na tela', () => {
    const assertions = screen.getByTestId('feedback-total-question');
    expect(assertions).toBeInTheDocument();
  });

  it('Testa a função de ranking', async () => {
    const buttonRanking = screen.getByRole('button', { name: /ranking/i} );
    userEvent.click(buttonRanking);
    jest.spyOn(window.localStorage.__proto__, 'setItem');  
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    await waitFor(() =>  expect(localStorage.getItem).toBeCalledTimes(1));
    await waitFor(() =>  expect(localStorage.setItem).toBeCalledTimes(1));
  });

});