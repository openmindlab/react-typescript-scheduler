import * as React from "react";
import { Component, CSSProperties } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import * as moment from "moment";
import { SchedulerData } from "./Scheduler";
import { Event } from "./SchedulerData";

interface EventItemPopoverProps {
    schedulerData: SchedulerData;
    eventItem: Event;
    title: string;
    startTime: string;
    endTime: string;
    statusColor: string;
    eventItemPopoverTemplateResolver?: (schedulerData: SchedulerData, eventItem: Event, title: string, start: moment.Moment, end: moment.Moment, statusColor: string) => JSX.Element;
}

class EventItemPopover extends Component<EventItemPopoverProps> {
    constructor(props: Readonly<EventItemPopoverProps>) {
        super(props);
    }

    public render() {
        const { schedulerData, eventItem, title, startTime, endTime, statusColor, eventItemPopoverTemplateResolver } = this.props;
        const start = moment(startTime);
        const end = moment(endTime);

        if (eventItemPopoverTemplateResolver) {
            return eventItemPopoverTemplateResolver(schedulerData, eventItem, title, start, end, statusColor);
        } else {
            alert(`You are over item: {id: ${eventItem.id}, you should use popover plugin.`);
            return<></>;
        }
    }
}

export default EventItemPopover;
