import * as React from "react";
import { Component, CSSProperties } from "react";

import AgendaResourceEvents from "./AgendaResourceEvents";
import { SchedulerData, EventActionFuncArgs, SlotClickedFuncArgs } from "./Scheduler";

interface AgendaViewProps {
    schedulerData: SchedulerData;
    subtitleGetter?: (args: EventActionFuncArgs) => string;
    eventItemClick?: (args: EventActionFuncArgs) => any;
    viewEventClick?: (args: EventActionFuncArgs) => void;
    viewEventText?: string;
    viewEvent2Click?: (args: EventActionFuncArgs) => void;
    viewEvent2Text?: string;
    slotClickedFunc?: (args: SlotClickedFuncArgs) => void | JSX.Element;
}

class AgendaView extends Component<AgendaViewProps> {
    constructor(props: Readonly<AgendaViewProps>) {
        super(props);
    }

    public render() {

        const { schedulerData } = this.props;
        const { config } = schedulerData;
        const { renderData } = schedulerData;
        const agendaResourceTableWidth = schedulerData.getResourceTableWidth();
        const tableHeaderHeight = schedulerData.getTableHeaderHeight();
        const resourceEventsList = renderData.map((item) => {
            return <AgendaResourceEvents
                {...this.props}
                resourceEvents={item}
                key={item.slotId} />;
        });
        const resourceName = schedulerData.isEventPerspective ? config.taskName : config.resourceName;
        const agendaViewHeader = config.agendaViewHeader;

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

export default AgendaView;
