import * as React from "react";
import { Component, CSSProperties } from "react";
import AgendaEventItem from "./AgendaEventItem";
import * as moment from "moment";
import { SchedulerData, EventActionFuncArgs, SlotClickedFuncArgs, SlotItemTemplateResolverArgs } from "./Scheduler";
import { RenderData} from "./SchedulerData";

/**
 * DateFORMAT
 */
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
            const start = moment(startDate);
            const end = moment(endDate).add(1, "days");
            const headerStart = moment(item.start);
            const headerEnd = moment(item.end);

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
            this.props.slotClickedFunc({ schedulerData, slot: resourceEvents });
        }}>{resourceEvents.slotName}</a>
            : <span>{resourceEvents.slotName}</span>;
        let slotItem = (
            <div style={{ width }} title={resourceEvents.slotName} className="overflow-text header2-text">
                {slotClickedFunc}
            </div>
        );
        if (!!this.props.slotItemTemplateResolver) {
            const temp = this.props.slotItemTemplateResolver({ schedulerData, slot: resourceEvents, slotClickedFunc: this.props.slotClickedFunc, width, clsName: "overflow-text header2-text" });
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
