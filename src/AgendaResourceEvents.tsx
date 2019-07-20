import * as React from 'react'
import { Component, CSSProperties } from 'react'
import AgendaEventItem from './AgendaEventItem'
import { DATE_FORMAT } from './types/DateFormats'
import * as moment from 'moment';
import { SchedulerData } from './Scheduler';
import ResourceEvents from './ResourceEvents';
import { RenderData, Event, Resource, EventGroup } from './SchedulerData';


interface AgendaResourceEventsProps {
    schedulerData: SchedulerData,
    resourceEvents: RenderData,
    subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string,
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => any,
    viewEventClick?: (schedulerData: SchedulerData, event: Event) => void,
    viewEventText?: string,
    viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void,
    viewEvent2Text?: string,
    slotClickedFunc?: (schedulerData: SchedulerData, item: RenderData) => void | JSX.Element
    slotItemTemplateResolver?: (schedulerData: SchedulerData, slot: RenderData | Resource | EventGroup | Event,
        slotClickedFunc: JSX.Element,
        width: number,
        clsName: string) => JSX.Element,
}
class AgendaResourceEvents extends Component<AgendaResourceEventsProps> {
    constructor(props: Readonly<AgendaResourceEventsProps>) {
        super(props);
    }

    render() {
        const { schedulerData, resourceEvents } = this.props;
        const { startDate, endDate, config } = schedulerData;
        let agendaResourceTableWidth = schedulerData.getResourceTableWidth();
        let width = agendaResourceTableWidth - 2;

        let events = [];
        resourceEvents.headerItems.forEach((item) => {
            let start = moment(startDate).format(DATE_FORMAT),
                end = moment(endDate).add(1, 'days').format(DATE_FORMAT),
                headerStart = moment(item.start).format(DATE_FORMAT),
                headerEnd = moment(item.end).format(DATE_FORMAT);

            if (start === headerStart && end === headerEnd) {
                item.events.forEach((evt) => {
                    let durationStart = moment(startDate);
                    let durationEnd = moment(endDate).add(1, 'days');
                    let eventStart = moment(evt.eventItem.start);
                    let eventEnd = moment(evt.eventItem.end);
                    let isStart = eventStart >= durationStart;
                    let isEnd = eventEnd < durationEnd;
                    let eventItem = <AgendaEventItem
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

        let slotClickedFunc = this.props.slotClickedFunc != undefined ? <a onClick={() => {
            this.props.slotClickedFunc(schedulerData, resourceEvents);
        }}>{resourceEvents.slotName}</a>
            : <span>{resourceEvents.slotName}</span>;
        let slotItem = (
            <div style={{ width: width }} title={resourceEvents.slotName} className="overflow-text header2-text">
                {slotClickedFunc}
            </div>
        );
        if (!!this.props.slotItemTemplateResolver) {
            let temp = this.props.slotItemTemplateResolver(schedulerData, resourceEvents, slotClickedFunc, width, "overflow-text header2-text");
            if (!!temp)
                slotItem = temp;
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

export default AgendaResourceEvents
