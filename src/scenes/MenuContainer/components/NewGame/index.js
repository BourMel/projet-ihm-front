import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { API_URL, colors, echo } from '../../../../utils';

export default class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        game_id: '',
        game_infos: {
          creator: {
            name: '',
          },
          players: [],
        },
      },
      is_creator: false,
    };

    // if got game props from other location
    if (props.location.state && props.location.state.game) {
      this.state.game = props.location.state.game;
    }

    if (
      localStorage.getItem('name') === this.state.game.game_infos.creator.name
    ) {
      this.state.is_creator = true;
    }

    // create a game if not joining one
    if (this.state.game.game_id === '') {
      const userToken = localStorage.getItem('token');
      axios
        .get(`${API_URL}/game/create?token=${userToken}`)
        .then(response => response.data)
        .then(json => {
          if (!json.success) {
            throw new Error('unable to create game');
          }
          this.setState({
            game: json.data,
            is_creator: true,
          });
          echo
            .channel(`channel-game:${this.state.game.game_id}`)
            .listen('UpdateGameEvent', e => {
              this.setState({
                game: e.content.game,
              });
            })
            .listen('StartGameEvent', e => {
              this.setState({
                game: e.content.game,
              });
              this.props.history.push({
                pathname: '/jeu',
                state: this.state,
              });
            });
        })
        .catch(() => {
          console.error('unable to create game');
          this.props.history.push('/login');
          window.location.reload();
        });
    } else {
      echo
        .channel(`channel-game:${this.state.game.game_id}`)
        .listen('UpdateGameEvent', e => {
          this.setState({
            game: e.content.game,
          });
        })
        .listen('StartGameEvent', e => {
          this.setState({
            game: e.content.game,
          });
          this.props.history.push({
            pathname: '/jeu',
            state: this.state,
          });
        });
    }
  }

  componentWillUnmount() {
    echo.leave(`channel-game:${this.state.game.game_id}`);
  }

  startGame(state) {
    const userToken = localStorage.getItem('token');
    const data = new FormData();
    data.append('game_id', state.game.game_id);
    axios.post(`${API_URL}/game/start?token=${userToken}`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  render() {
    var newGameStyle = {
      fontSize: '2em',
      lineHeight: '1.5',
      textColor: colors.blackColor,

      title: {
        fontSize: '1.9em',
        textAlign: 'center',
      },
      cellule: {
        padding: '2.5vh',
      },
      table: {
        margin: 'auto',
      },
    };
    const launchBtn = this.state.is_creator ? (
      <button onClick={this.startGame.bind(this, this.state)}>
        <FormattedMessage id="NewGame.startLink" />
      </button>
    ) : (
      ''
    );
    return (
      <div style={newGameStyle}>
        <h1 style={newGameStyle.title}>
          <FormattedMessage id="NewGame.title" />
        </h1>

        <Link to="/">
          <FormattedMessage id="NewGame.backToMenu" />
        </Link>

        <p>GAME_ID: {this.state.game.game_id}</p>
        <p>GAME_INFOS: {JSON.stringify(this.state.game.game_infos.players)}</p>

        <p>{launchBtn}</p>

        <table style={newGameStyle.table}>
          <tbody>
            <tr>
              <td style={newGameStyle.cellule}>Joueur 1</td>
              <td style={newGameStyle.cellule}>
                {this.state.game.game_infos.creator.name}
              </td>
            </tr>
            <tr>
              <td style={newGameStyle.cellule}>Joueur 2</td>
              <td style={newGameStyle.cellule}>
                <form>
                  <select>
                    <option value="player">Joueur</option>
                    <option value="IA_easy">Ordi facile</option>
                    <option value="IA_normal">Ordi moyen</option>
                  </select>
                </form>
              </td>
            </tr>
            <tr>
              <td style={newGameStyle.cellule}>Joueur 3</td>
              <td style={newGameStyle.cellule}>
                <form>
                  <select>
                    <option value="player">Joueur</option>
                    <option value="IA_easy">Ordi facile</option>
                    <option value="IA_normal">Ordi moyen</option>
                    <option value="none">Aucun</option>
                  </select>
                </form>
              </td>
            </tr>
            <tr>
              <td style={newGameStyle.cellule}>Joueur 4</td>
              <td style={newGameStyle.cellule}>
                <form>
                  <select>
                    <option value="player">Joueur</option>
                    <option value="IA_easy">Ordi facile</option>
                    <option value="IA_normal">Ordi moyen</option>
                    <option value="none">Aucun</option>
                  </select>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}