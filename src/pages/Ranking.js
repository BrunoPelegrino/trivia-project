import React from 'react';
import { Link } from 'react-router-dom';

class Ranking extends React.Component {
  state = {
    rankingList: [],
  }

  componentDidMount() {
    const storedRanking = localStorage.getItem('ranking') || [];
    const parsedRanking = typeof storedRanking === 'string'
      ? JSON.parse(storedRanking) : [];
    this.setState({
      rankingList: parsedRanking,
    });
  }

  render() {
    const { rankingList } = this.state;
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        <Link to="/">
          <button
            type="button"
            data-testid="btn-go-home"
          >
            Home
          </button>
        </Link>
        <section>
          <ul>
            {
              rankingList.length > 0 && rankingList.sort((a, b) => b.score - a.score)
                .map((ranking, index) => (
                  <li key={ index } data-testid="ranking-item">
                    <img src={ ranking.picture } alt={ ranking.name } />
                    <span data-testid={ `player-name-${index}` }>{ ranking.name }</span>
                    <span data-testid={ `player-score-${index}` }>{ ranking.score }</span>
                  </li>
                ))
            }
          </ul>
        </section>
      </div>
    );
  }
}

export default Ranking;
