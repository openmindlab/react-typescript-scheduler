import * as React from 'react';
import { Component } from 'react';

class ViewSrcCode extends Component<{ srcCodeUrl: string }, {}> {
  constructor(props: Readonly<{ srcCodeUrl: string }>) {
    super(props);
  }

  public render() {
    const { srcCodeUrl } = this.props;
    return (
      <span style={{ marginLeft: '10px' }} className="help-text">
        (
        <a href={srcCodeUrl} target="_blank">
          &lt;/&gt;View example source code
        </a>
        )
      </span>
    );
  }
}

export default ViewSrcCode;
