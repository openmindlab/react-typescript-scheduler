import * as React from "react";
import { Component, CSSProperties } from "react";
import Popover from "antd/lib/popover";
import EventItemPopover from "./EventItemPopover";
import { SchedulerData, SlotItemTemplateResolverArgs, SlotClickedFuncArgs, EventItemTemplateResolverArgs, EventActionFuncArgs } from "./Scheduler";
import { RenderData, Resource, EventGroup, Event } from "./SchedulerData";

interface AgendaEventItemProps {
    schedulerData: SchedulerData;
    subtitleGetter?: (args: EventActionFuncArgs) => string;
    eventItemClick?: (args: EventActionFuncArgs) => any;
    viewEventClick?: (args: EventActionFuncArgs) => void;
    viewEventText?: string;
    viewEvent2Click?: (args: EventActionFuncArgs) => void;
    viewEvent2Text?: string;
    slotClickedFunc?: (args: SlotClickedFuncArgs) => void | JSX.Element;
    resourceEvents: RenderData;
    isStart: boolean;
    isEnd: boolean;
    eventItem: Event;
    slotItemTemplateResolver?: (args: SlotItemTemplateResolverArgs) => JSX.Element;
    eventItemTemplateResolver?: (args: EventItemTemplateResolverArgs) => JSX.Element;
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

        let eventItemTemplate = (
            <div className={roundCls + " event-item"} key={eventItem.id}
                style={{ height: config.eventItemHeight, maxWidth: config.agendaMaxEventWidth, backgroundColor: bgColor }}>
                <span style={{ marginLeft: "10px", lineHeight: `${config.eventItemHeight}px` }}>{titleText}</span>
            </div>
        );
        if (this.props.eventItemTemplateResolver != undefined) {
            eventItemTemplate = this.props.eventItemTemplateResolver({
                schedulerData, 
                event: eventItem, 
                bgColor, 
                isStart, 
                isEnd, 
                mustAddCssClass: "event-item", 
                mustBeHeight: config.eventItemHeight, 
                agendaMaxEventWidth: config.agendaMaxEventWidth});
        }

        return (config.eventItemPopoverEnabled ? (
            <EventItemPopover
                {...this.props}
                title={eventItem.title}
                startTime={eventItem.start}
                endTime={eventItem.end}
                statusColor={bgColor}
            />
        ) : (
                <span>
                    <a className="day-event" onClick={() => { if (!!eventItemClick) { eventItemClick({schedulerData, event: eventItem}); } }}>
                        {eventItemTemplate}
                    </a>
                </span>
            )
        );
    }
}

export default AgendaEventItem;
