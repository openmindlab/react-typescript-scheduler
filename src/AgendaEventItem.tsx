import * as React from "react";
import { Component, CSSProperties } from "react";
import Popover from "antd/lib/popover";
import EventItemPopover from "./EventItemPopover";
import { SchedulerData } from "./Scheduler";
import { RenderData, Resource, EventGroup, Event } from "./SchedulerData";

interface AgendaEventItemProps {
    isStart: boolean;
    isEnd: boolean;
    eventItem: Event;
    eventItemTemplateResolver?: (schedulerData: SchedulerData, eventItem: Event, bgColor: string, isStart: boolean, isEnd: boolean, name: string, eventItemHeight: number, agendaMaxEventWidth: number) => JSX.Element;
    schedulerData: SchedulerData;
    resourceEvents: RenderData;
    subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string;
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => any;
    viewEventClick?: (schedulerData: SchedulerData, event: Event) => void;
    viewEventText?: string;
    viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void;
    viewEvent2Text?: string;
    slotClickedFunc?: (schedulerData: SchedulerData, item: RenderData) => void | JSX.Element;
    slotItemTemplateResolver?: (
        schedulerData: SchedulerData,
        slot: RenderData | Resource | EventGroup | Event,
        slotClickedFunc: JSX.Element,
        width: number,
        clsName: string) => JSX.Element;
}

class AgendaEventItem extends Component<AgendaEventItemProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        const { eventItem, isStart, isEnd, eventItemClick, schedulerData } = this.props;
        const { config } = schedulerData;
        const roundCls = isStart ? (isEnd ? "round-all" : "round-head") : (isEnd ? "round-tail" : "round-none");
        let bgColor = config.defaultEventBgColor;
        if (!!eventItem.bgColor) {
            bgColor = eventItem.bgColor;
        }

        const titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, eventItem);
        const content = (
            <EventItemPopover
                {...this.props}
                title={eventItem.title}
                startTime={eventItem.start}
                endTime={eventItem.end}
                statusColor={bgColor}
            />
        );

        let eventItemTemplate = (
            <div className={roundCls + " event-item"} key={eventItem.id}
                style={{ height: config.eventItemHeight, maxWidth: config.agendaMaxEventWidth, backgroundColor: bgColor }}>
                <span style={{ marginLeft: "10px", lineHeight: `${config.eventItemHeight}px` }}>{titleText}</span>
            </div>
        );
        if (this.props.eventItemTemplateResolver != undefined) {
            eventItemTemplate = this.props.eventItemTemplateResolver(schedulerData, eventItem, bgColor, isStart, isEnd, "event-item", config.eventItemHeight, config.agendaMaxEventWidth);
        }

        return (config.eventItemPopoverEnabled ?
            <Popover placement="bottomLeft" content={content} trigger="hover">
                <a className="day-event" onClick={() => { if (!!eventItemClick) { eventItemClick(schedulerData, eventItem); } }}>
                    {eventItemTemplate}
                </a>
            </Popover> :
            <span>
                <a className="day-event" onClick={() => { if (!!eventItemClick) { eventItemClick(schedulerData, eventItem); } }}>
                    {eventItemTemplate}
                </a>
            </span>
        );
    }
}

export default AgendaEventItem;
