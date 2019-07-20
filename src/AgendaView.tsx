import * as React from 'react'
import { Component, CSSProperties } from 'react'

import AgendaResourceEvents from './AgendaResourceEvents'
import { SchedulerData } from './Scheduler';
import { EventGroup, Resource, Event, RenderData } from './SchedulerData';

interface AgendaViewProps {
    schedulerData: SchedulerData,
    subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string,
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => any,
    viewEventClick?: (schedulerData: SchedulerData, event: Event) => void,
    viewEventText?: string,
    viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void,
    viewEvent2Text?: string,
    slotClickedFunc?: (schedulerData: SchedulerData, item: RenderData) => void | JSX.Element,
}

class AgendaView extends Component<AgendaViewProps> {
    constructor(props: Readonly<AgendaViewProps>) {
        super(props);
    }

    render() {

        const { schedulerData } = this.props;
        const { config } = schedulerData;
        const { renderData } = schedulerData;
        let agendaResourceTableWidth = schedulerData.getResourceTableWidth(), tableHeaderHeight = schedulerData.getTableHeaderHeight();
        let resourceEventsList = renderData.map((item) => {
            return <AgendaResourceEvents
                {...this.props}
                resourceEvents={item}
                key={item.slotId} />
        });
        let resourceName = schedulerData.isEventPerspective ? config.taskName : config.resourceName;
        let agendaViewHeader = config.agendaViewHeader;

        return (
            <tr>
                <td>
                    <table className="scheduler-table">
                        <thead>
                            <tr style={{ height: tableHeaderHeight }}>
                                <th style={{ width: agendaResourceTableWidth }} className="header3-text">{resourceName}</th>
                                <th className="header3-text">{agendaViewHeader}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resourceEventsList}
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    }
}

export default AgendaView