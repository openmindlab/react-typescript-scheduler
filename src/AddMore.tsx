import * as React from "react";
import { Component, CSSProperties } from "react";
import { Header } from "./SchedulerData";
import { SchedulerData } from "./Scheduler";

interface AddMoreProps {
    schedulerData: SchedulerData;
    number: number;
    left: number;
    width: number;
    top: number;
    clickAction: (headerItem: Header) => any;
    headerItem: Header;
}

class AddMore extends Component<AddMoreProps> {
    constructor(props: Readonly<AddMoreProps>) {
        super(props);
    }

    public render() {
        const { number: num, left, width, top, clickAction, headerItem, schedulerData } = this.props;
        const { config } = schedulerData;
        const content = "+" + num + "more";

        return (
            <a className="timeline-event" style={{ left, width, top }} onClick={() => { clickAction(headerItem); }} >
                <div style={{ height: config.eventItemHeight, color: "#999", textAlign: "center" }}>
                    {content}
                </div>
            </a>
        );
    }
}

export default AddMore;
