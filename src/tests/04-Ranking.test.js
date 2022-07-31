import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Testa a Página de Ranking' , () => {
  beforeEach(() => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const initialRanking = [
      {name:'Daniel', score: '200', picture: 'https://www.gravatar.com/avatar/tryber@teste.com'}, 
      {name:'Luiz', score: '190', picture: 'https://www.gravatar.com/avatar/tryber@teste.com'},
     ];
     const rankingString = JSON.stringify(initialRanking);
    localStorage.setItem('ranking', rankingString);
  });
  it('Testa se o botão home volta para a página de login', () => {
    const homeButton = screen.getByRole('button', { name:/home/i});
    userEvent.click(homeButton);
    const settingsButton = screen.getByRole('button', { name:/configurações/i});
    expect(settingsButton).toBeInTheDocument();
  });
  it('Testa se o título contém a palavra Ranking', () => {
    const h1 = screen.getByRole('heading', { nome: /Ranking/i });
    expect(h1).toBeInTheDocument();
  });
  it('Testa o Ranking', () => {
    expect(screen.getByTestId('player-name-0')).toBeInTheDocument();
    expect(screen.getByTestId('player-name-0').innerHTML).toBe('Daniel')
    expect(screen.getByTestId('player-score-0')).toBeInTheDocument();
    expect(screen.getByTestId('player-score-0').innerHTML).toBe('200')

    expect(screen.getByTestId('player-name-1')).toBeInTheDocument();
    expect(screen.getByTestId('player-name-1').innerHTML).toBe('Luiz')
    expect(screen.getByTestId('player-score-1')).toBeInTheDocument();
    expect(screen.getByTestId('player-score-1').innerHTML).toBe('190')

    expect(screen.getAllByTestId('ranking-item')).toHaveLength(2);
  });
});
