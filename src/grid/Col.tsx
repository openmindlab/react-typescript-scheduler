import * as React from 'react';


interface Props {
  span?: number;
  className?: string;
}
export default class Col extends React.Component<Props> {

  render() {
    const {
      children,
      ...others
    } = this.props;
    return <div className="col">
      {children}
    </div>;
  }
}