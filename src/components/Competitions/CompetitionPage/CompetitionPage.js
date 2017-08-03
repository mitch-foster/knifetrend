import React from 'react';
import { gql } from 'react-apollo';

import graphqlWithLoading from 'kt-hocs/graphqlWithLoading';

import Header from './../Header';
import CompetitionDetails from './CompetitionDetails';
import EntriesContainer from './EntriesContainer';

const url = "https://s3-us-west-2.amazonaws.com/knifetrend-assets/kt-competitions-entries-header.jpg";

const CompetitionPage = ({ data: { competition }, match }) => {
  return (
    <div>
      <Header imgUrl={ url } title={ competition.name } />
      <CompetitionDetails competition={ competition } />
      <EntriesContainer competition={ competition } />
    </div>
  )
}

const CompetitionData = gql`
  query($id: Int!) {
    competition(id:$id) {
      id
      name
      desc
      award
      awardValue
      endDate
      ...EntriesContainer
    }
  }
  ${EntriesContainer.fragment}
`

export default graphqlWithLoading(CompetitionData,{
  options: props => ({
    variables:{ id: props.match.params.id }
  })
})(CompetitionPage);
