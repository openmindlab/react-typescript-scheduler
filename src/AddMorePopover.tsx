import * as React from 'react'
import { Component, CSSProperties } from 'react'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Icon from 'antd/lib/icon'
import 'antd/lib/grid/style/index.css'
import EventItem from './EventItem'
import DnDSource from './DnDSource'
import * as moment from 'moment';
import { SchedulerData } from './Scheduler';
import { Event } from './SchedulerData'

interface AddMorePopoverProps {
    schedulerData: any,
    headerItem: any,
    left: number,
    top: number,
    height: number,
    closeAction: (action: any) => void,
    moveEvent?: (schedulerData: SchedulerData, event: Event, slotId: string, slotName: string, start: string, end: string) => void,
    subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string,
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => any,
    viewEventClick?: (schedulerData: SchedulerData, event: Event) => void,
    viewEventText?: string,
    viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void,
    viewEvent2Text?: string,
    eventItemTemplateResolver?: (schedulerData: SchedulerData, eventItem: Event, bgColor: string, isStart: boolean, isEnd: boolean, name: string, eventItemHeight: number, agendaMaxEventWidth: number) => JSX.Element

}

interface AddMorePopoverState {
    dndSource: DnDSource
}

class AddMorePopover extends Component<AddMorePopoverProps, AddMorePopoverState> {
    constructor(props: Readonly<AddMorePopoverProps>) {
        super(props);

        this.state = {
            dndSource: new DnDSource((props) => { return props.eventItem; }, EventItem),
        }
    }

    render() {
        const { headerItem, left, top, height, closeAction, schedulerData } = this.props;
        const { config } = schedulerData;
        const { time, start, end, events } = headerItem;
        let header = moment(time).format(config.addMorePopoverHeaderFormat);
        let durationStart = moment(start);
        let durationEnd = moment(end);
        let eventList = [];
        let i = 0;
        let DnDEventItem = this.state.dndSource.getDragSource();
        events.forEach((evt) => {
            if (evt !== undefined) {
                i++;
                let eventStart = moment(evt.eventItem.start);
                let eventEnd = moment(evt.eventItem.end);
                let isStart = eventStart >= durationStart;
                let isEnd = eventEnd < durationEnd;
                let eventItemLeft = 10;
                let eventItemWidth = 138;
                let eventItemTop = 12 + i * config.eventItemLineHeight;
                let eventItem = <DnDEventItem
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
                />
                eventList.push(eventItem);
            }
        });

        return (
            <div className="add-more-popover-overlay" style={{ left: left, top: top, height: height, width: '170px' }}>
                <Row type="flex" justify="space-between" align="middle">
                    <Col span="22">
                        <span className="base-text">{header}</span>
                    </Col>
                    <Col span="2">
                        <span onClick={() => { closeAction(undefined); }}><Icon type="cross"></Icon></span>
                    </Col>
                </Row>
                {eventList}
            </div>
        );
    }
}

export default AddMorePopover