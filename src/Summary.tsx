import * as React from 'react'
import { Component, CSSProperties, ReactNode } from 'react'
import { SummaryPos } from './types/SummaryPos'
import { SchedulerData } from './Scheduler';

interface SummaryProps {
    schedulerData: SchedulerData,
    summary: Summary,
    left: number,
    width: number,
    top: number,
    key: string
}

class Summary extends Component<SummaryProps> {
    color: string;
    fontSize: number;
    text: ReactNode;

    constructor(props: Readonly<SummaryProps>) {
        super(props);
    }

    render() {
        const { summary, left, width, top, schedulerData } = this.props;
        const { config } = schedulerData;
        let style: CSSProperties = {
            height: config.eventItemHeight,
            color: config.summaryColor,
            textAlign: 'center',
            marginLeft: '6px',
            marginRight: '6px',
            fontSize: undefined
        };

        if (summary.color != undefined)
            style.color = summary.color;
        if (config.summaryPos === SummaryPos.TopRight || config.summaryPos === SummaryPos.BottomRight)
            style.textAlign = 'right';
        else if (config.summaryPos === SummaryPos.TopLeft || config.summaryPos === SummaryPos.BottomLeft)
            style.textAlign = 'left';
        if (summary.fontSize != undefined)
            style.fontSize = summary.fontSize

        return <>
            <a className="timeline-event header2-text" style={{ left: left, width: width, top: top, cursor: 'default' }} >
                <div style={style}>
                    {summary.text}
                </div>
            </a>
        </>
    }
}

export default Summary