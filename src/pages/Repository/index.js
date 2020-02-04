import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import { Loading, Owner, IssuesList } from './styles';
import Container from '../../components/Container';


export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        respository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
  }

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [respository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        }
      }),
    ]);

    this.setState({
      respository: respository.data,
      issues: issues.data,
      loading: false,
    });

  }

  render() {

    const { respository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos respostórios</Link>
          <img src={respository.owner.avatar_url} alt={respository.owner.login} />
          <h1>{respository.name}</h1>
          <p>{respository.description}</p>
        </Owner>

        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }

}
