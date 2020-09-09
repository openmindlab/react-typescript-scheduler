import * as React from 'react';
import { Component, CSSProperties } from 'react';

class Nav extends Component<{}, {}> {
  constructor(props: Readonly<{}>) {
    super(props);
  }

  public render() {
    const ulStyle: CSSProperties = {
      listStyle: 'none',
      margin: '0px',
      padding: '0px',
      width: 'auto',
    };
    const liStyle: CSSProperties = {
      float: 'left',
      marginLeft: '20px',
    };
    return (
      <div>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <span style={{ fontWeight: 'bold' }}>
              <a href="https://github.com/StephenChou1017/react-big-scheduler" target="_blank">
                React Big Scheduler
              </a>
            </span>
          </li>
        </ul>
        <div style={{ clear: 'both', marginBottom: '24px' }}></div>
      </div>
    );
  }
}

export default Nav;
