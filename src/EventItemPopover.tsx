import * as React from "react";
import { Component, CSSProperties } from "react";
import * as moment from "moment";
import { SchedulerData, EventItemPopoverResolverArgs } from "./Scheduler";
import { Event } from "./SchedulerData";

import Popover from "antd/lib/popover";

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
    eventItemPopoverTemplateResolver?: (resolver: EventItemPopoverResolverArgs) => JSX.Element;
}

class EventItemPopover extends Component<EventItemPopoverProps> {
    constructor(props: Readonly<EventItemPopoverProps>) {
        super(props);
    }

    public render() {
        const { schedulerData, eventItem, title, startTime, endTime, statusColor, eventItemPopoverTemplateResolver, connectDragPreview, connectDragSource, timelineEvent } = this.props;
        const start = moment(startTime);
        const end = moment(endTime);
        {/* From agendaEventItem
            <Popover placement="bottomLeft" content={content} trigger="hover">
        <a className="day-event" onClick={() => { if (!!eventItemClick) { eventItemClick(schedulerData, eventItem); } }}>
            {eventItemTemplate}
        </a>
    </Popover> :
    */}
        if (eventItemPopoverTemplateResolver) {
            const c: EventItemPopoverResolverArgs = {
                schedulerData,
                eventItem,
                title,
                statusColor,
                end,
                start,
                timelineEvent,
                connectDragPreview,
                connectDragSource,
            };
            return eventItemPopoverTemplateResolver(c);
        } else {
            return <>
                <Popover placement="bottomLeft" content={<>Agoiii</>} trigger="hover">
                    {
                        connectDragPreview(
                            connectDragSource(timelineEvent),
                        )
                    }
                </Popover></>;
        }
    }
}

export default EventItemPopover;
