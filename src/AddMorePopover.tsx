
import { Icon } from '@material-ui/core';
import * as moment from "moment";
import * as React from "react";
import { Component } from "react";
import Col from "../src/grid/Col";
import Row from "../src/grid/Row";
import DnDSource from "./DnDSource";
import EventItem from "./EventItem";
import { SchedulerData } from "./Scheduler";
import { Event } from "./SchedulerData";

interface AddMorePopoverProps {
    schedulerData: any;
    headerItem: any;
    left: number;
    top: number;
    height: number;
    closeAction: (action: any) => void;
    moveEvent?: (schedulerData: SchedulerData, event: Event, slotId: string, slotName: string, start: string, end: string) => void;
    subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string;
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => any;
    viewEventClick?: (schedulerData: SchedulerData, event: Event) => void;
    viewEventText?: string;
    viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void;
    viewEvent2Text?: string;
    eventItemTemplateResolver?: (schedulerData: SchedulerData, eventItem: Event, bgColor: string, isStart: boolean, isEnd: boolean, name: string, eventItemHeight: number, agendaMaxEventWidth: number) => JSX.Element;

}

interface AddMorePopoverState {
    dndSource: DnDSource;
}

class AddMorePopover extends Component<AddMorePopoverProps, AddMorePopoverState> {
    constructor(props: Readonly<AddMorePopoverProps>) {
        super(props);

        this.state = {
            dndSource: new DnDSource((p: { eventItem: Event }) => p.eventItem, EventItem),
        };
    }

    public render() {
        const { headerItem, left, top, height, closeAction, schedulerData } = this.props;
        const { config } = schedulerData;
        const { time, start, end, events } = headerItem;
        const header = moment(time).format(config.addMorePopoverHeaderFormat);
        const durationStart = moment(start);
        const durationEnd = moment(end);
        const eventList = [];
        let i = 0;
        const DnDEventItem = this.state.dndSource.getDragSource();
        events.forEach((evt: any) => {
            if (evt !== undefined) {
                i++;
                const eventStart = moment(evt.eventItem.start);
                const eventEnd = moment(evt.eventItem.end);
                const isStart = eventStart >= durationStart;
                const isEnd = eventEnd < durationEnd;
                const eventItemLeft = 10;
                const eventItemWidth = 138;
                const eventItemTop = 12 + i * config.eventItemLineHeight;
                const eventItem = <DnDEventItem
                    {...this.props}
                    key={evt.eventItem.id}
                    eventItem={evt.eventItem}
                    leftIndex={0}
                    isInPopover={true}
                    isStart={isStart}
                    isEnd={isEnd}
                    rightIndex={1}
                    left={eventItemLeft}
                    width={eventItemWidth}
                    top={eventItemTop}
                />;
                eventList.push(eventItem);
            }
        });

        return (
            <div className="add-more-popover-overlay" style={{ left, top, height, width: "170px" }}>
                <Row type="flex" justify="space-between" align="middle">
                    <Col span={22}>
                        <span className="base-text">{header}</span>
                    </Col>
                    <Col span={2}>
                        <span onClick={() => { closeAction(undefined); }}><Icon>close</Icon></span>
                    </Col>
                </Row>
                {eventList}
            </div>
        );
    }
}

export default AddMorePopover;
