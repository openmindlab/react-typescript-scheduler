import * as React from "react";
import { Component, CSSProperties } from "react";
import * as moment from "moment";
import { SchedulerData, EventItemPopoverResolverArgs, EventItemPopoverResolverDnDArgs } from "./Scheduler";
import { Event } from "./SchedulerData";

import Popover from "antd/lib/popover";
import { resolve } from "path";

interface EventItemPopoverProps {
    schedulerData: SchedulerData;
    eventItem: Event;
    title: string;
    startTime: moment.Moment;
    endTime: moment.Moment;
    statusColor: string;
    timelineEvent?: JSX.Element;
    connectDragSource?: (action: any) => any;
    connectDragPreview?: (action: any) => any;
    eventItemPopoverTemplateResolver?: (resolver: EventItemPopoverResolverArgs, dnd: EventItemPopoverResolverDnDArgs) => JSX.Element;
}

class EventItemPopover extends Component<EventItemPopoverProps> {
    constructor(props: Readonly<EventItemPopoverProps>) {
        super(props);
    }

    public render() {
        const { schedulerData, eventItem, title, startTime, endTime, statusColor, eventItemPopoverTemplateResolver, connectDragPreview, connectDragSource, timelineEvent } = this.props;
        const start = moment(startTime);
        const end = moment(endTime);
        if (eventItemPopoverTemplateResolver) {
            return eventItemPopoverTemplateResolver(
                {
                    schedulerData,
                    eventItem,
                    title,
                    statusColor,
                    end,
                    start,
                }, {
                    timelineEvent,
                    connectDragPreview,
                    connectDragSource,
                },
            );
        } else {
            return <>Missing popover plugin</>;
        }
    }
}

export default EventItemPopover;
