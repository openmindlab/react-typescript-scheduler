import * as React from "react";
import { Component, CSSProperties } from "react";
import AgendaEventItem from "./AgendaEventItem";
import { DATE_FORMAT } from "./types/DateFormats";
import * as moment from "moment";
import { SchedulerData, EventActionFuncArgs, SlotClickedFuncArgs, SlotItemTemplateResolverArgs } from "./Scheduler";
import { RenderData, Event, Resource, EventGroup } from "./SchedulerData";

interface AgendaResourceEventsProps {
    schedulerData: SchedulerData;
    subtitleGetter?: (args: EventActionFuncArgs) => string;
    eventItemClick?: (args: EventActionFuncArgs) => any;
    viewEventClick?: (args: EventActionFuncArgs) => void;
    viewEventText?: string;
    viewEvent2Click?: (args: EventActionFuncArgs) => void;
    viewEvent2Text?: string;
    slotClickedFunc?: (args: SlotClickedFuncArgs) => void | JSX.Element;
    resourceEvents: RenderData;
    slotItemTemplateResolver?: (args: SlotItemTemplateResolverArgs) => JSX.Element;
}
class AgendaResourceEvents extends Component<AgendaResourceEventsProps> {
    constructor(props: Readonly<AgendaResourceEventsProps>) {
        super(props);
    }

    public render() {
        const { schedulerData, resourceEvents } = this.props;
        const { startDate, endDate, config } = schedulerData;
        const agendaResourceTableWidth = schedulerData.getResourceTableWidth();
        const width = agendaResourceTableWidth - 2;

        const events = [];
        resourceEvents.headerItems.forEach((item) => {
            const start = moment(startDate).format(DATE_FORMAT);
            const end = moment(endDate).add(1, "days").format(DATE_FORMAT);
            const headerStart = moment(item.start).format(DATE_FORMAT);
            const headerEnd = moment(item.end).format(DATE_FORMAT);

            if (start === headerStart && end === headerEnd) {
                item.events.forEach((evt) => {
                    const durationStart = moment(startDate);
                    const durationEnd = moment(endDate).add(1, "days");
                    const eventStart = moment(evt.eventItem.start);
                    const eventEnd = moment(evt.eventItem.end);
                    const isStart = eventStart >= durationStart;
                    const isEnd = eventEnd < durationEnd;
                    const eventItem = <AgendaEventItem
                        {...this.props}
                        key={evt.eventItem.id}
                        eventItem={evt.eventItem}
                        isStart={isStart}
                        isEnd={isEnd}
                    />;
                    events.push(eventItem);
                });
            }
        });

        const slotClickedFunc = this.props.slotClickedFunc != undefined ? <a onClick={() => {
            this.props.slotClickedFunc({ schedulerData, item: resourceEvents });
        }}>{resourceEvents.slotName}</a>
            : <span>{resourceEvents.slotName}</span>;
        let slotItem = (
            <div style={{ width }} title={resourceEvents.slotName} className="overflow-text header2-text">
                {slotClickedFunc}
            </div>
        );
        if (!!this.props.slotItemTemplateResolver) {
            const temp = this.props.slotItemTemplateResolver({schedulerData, resourceEvents: resourceEvents, slotClickedFunc: this.props.slotClickedFunc, width, clsName: "overflow-text header2-text"});
            if (!!temp) {
                slotItem = temp;
            }
        }

        return (
            <tr style={{ minHeight: config.eventItemLineHeight + 2 }}>
                <td data-resource-id={resourceEvents.slotId}>
                    {slotItem}
                </td>
                <td>
                    <div className="day-event-container">
                        {events}
                    </div>
                </td>
            </tr>
        );
    }
}

export default AgendaResourceEvents;
