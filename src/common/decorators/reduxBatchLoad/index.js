// @flow

import { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

type Options = {
  fetchResourceData: (id: string) => ReduxThunk,
  fetchGw2Data: (Array<number>) => Promise<*>,
  storeKeyResource: string,
  storeKeyGw2: string,
  resource: 'users' | 'characters' | 'guilds',
  emptyUserData?: Array<typeof undefined>,
};

const withBatchLoad = ({
  fetchResourceData,
  storeKeyResource,
  fetchGw2Data,
  storeKeyGw2,
  resource,
  emptyUserData,
}: Options) => {
  const selector = createSelector(
    store =>
      (store[resource].data[store[resource].selected] || {})[storeKeyResource] || emptyUserData,
    store => store[storeKeyGw2] || {},
    (resourceData, gw2Data) => ({
      resourceData,
      gw2Data,
    })
  );

  return (WrappedComponent: React.ComponentType<*>) =>
    connect(
      selector,
      {
        fetchResourceData,
        fetchGw2Data,
      }
    )(
      class WithBatchLoad extends Component<*> {
        props: {
          id: string,
          fetchResourceData: string => Promise<*>,
          fetchGw2Data: (Array<number>) => Promise<*>,
          gw2Data: any,
          resourceData: any,
        };

        componentDidMount() {
          this.props
            .fetchResourceData(this.props.id)
            .then(
              action => action && this.props.fetchGw2Data(action.payload.data.map(item => item.id))
            );
        }

        render() {
          return <WrappedComponent {...this.props} />;
        }
      }
    );
};

export default withBatchLoad;
