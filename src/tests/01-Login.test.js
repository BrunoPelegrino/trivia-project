import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

describe('Testa a Página de Login' , () => {

  it('Testa o input de nome', () => {
    renderWithRouterAndRedux(<App />);
    const userInput = screen.getByRole('textbox', {
      name: /seu nome/i
    });
    expect(userInput).toBeInTheDocument()

    userEvent.type(userInput, 'Nome');

    expect(userInput).toHaveProperty('value', 'Nome')
  })

  it('Testa o input de email', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByRole('textbox', {
      name: /seu email/i
    });
    expect(emailInput).toBeInTheDocument()

    userEvent.type(emailInput, 'test@test.com');

    expect(emailInput).toHaveProperty('value', 'test@test.com')
  })

  it('Testa o Botão de Login', async () => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');  
    
    const initialState = {
      player: {
        name: 'nome-da-pessoa',
        assertions: 'número-de-acertos',
        score: 'pontuação',
        gravatarEmail: 'email-da-pessoa',
      }
      };
    const { store } = renderWithRouterAndRedux(<App />, initialState);
    const buttonLogin = screen.getByRole('button', {
      name: /Play/i
    });
    expect(buttonLogin).toBeInTheDocument();
    expect(buttonLogin).toBeDisabled();

    const userInput = screen.getByRole('textbox', {
      name: /seu nome/i
    });
    const emailInput = screen.getByRole('textbox', {
      name: /seu email/i
    });

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(userInput, 'Nome');

    expect(buttonLogin).not.toBeDisabled();

    userEvent.click(buttonLogin);

    await waitFor(() => expect(store.getState().player.name).toBe('Nome'))
    await waitFor(() => expect(store.getState().player.gravatarEmail).toBe('test@test.com'))
    expect(localStorage.setItem).toBeCalledTimes(1);
  })

  it('Testa o botão de configurações', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const configButton = screen.getByRole('button', {
      name: /configurações/i
    });
    userEvent.click(configButton);
    expect(history.location.pathname).toBe('/settings')
  })
})