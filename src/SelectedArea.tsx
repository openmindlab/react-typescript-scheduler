import * as React from 'react'
import { Component, CSSProperties } from 'react'
import { SchedulerData } from './Scheduler';


interface SelectedAreaProps {
    schedulerData: SchedulerData,
    left: number,
    width: number,
}
class SelectedArea extends Component<SelectedAreaProps> {
    constructor(props: Readonly<SelectedAreaProps>) {
        super(props);
    }

    render() {
        const { left, width, schedulerData } = this.props;
        const { config } = schedulerData;

        return <div className="selected-area" style={{ left: left, width: width, top: 0, bottom: 0, backgroundColor: config.selectedAreaColor }}>
        </div>
    }
}

export default SelectedArea