import * as React from 'react';

interface Props {
  type?: string;
  align?: string;
  justify?: string;
}


export default class Row extends React.Component<Props> {

  render() {
    const {
      children,
      ...others
    } = this.props;
    return <div className="row">
      {children}
    </div>;
  }
}