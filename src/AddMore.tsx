import * as React from 'react'
import { Component, CSSProperties } from 'react'
import { Header } from './SchedulerData';

interface AddMoreProps {
    schedulerData: any,
    number: number,
    left: number,
    width: number,
    top: number,
    clickAction: (headerItem: Header) => any,
    headerItem: any,
    
}

class AddMore extends Component<AddMoreProps> {
    constructor(props: Readonly<AddMoreProps>) {
        super(props);
    }

    render() {
        const { number, left, width, top, clickAction, headerItem, schedulerData } = this.props;
        const { config } = schedulerData;
        let content = '+' + number + 'more';

        return (
            <a className="timeline-event" style={{ left: left, width: width, top: top }} onClick={() => { clickAction(headerItem); }} >
                <div style={{ height: config.eventItemHeight, color: '#999', textAlign: 'center' }}>
                    {content}
                </div>
            </a>
        );
    }
}

export default AddMore