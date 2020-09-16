import * as React from 'react';
import moment from 'moment';
import { Component, CSSProperties } from 'react';
import AddMore from './AddMore';
import Summary from './Summary';
import SelectedArea from './SelectedArea';
import { CellUnits } from './types/CellUnits';
import { DATETIME_FORMAT } from './types/DateFormats';
import { SummaryPos } from './types/SummaryPos';
import { getPos } from './Util';
import { DnDTypes } from './types/DnDTypes';
import { SchedulerData } from './Scheduler';
import { RenderData, Header } from './SchedulerData';
import DnDSource from './DnDSource';

const supportTouch = 'ontouchstart' in window;
interface ResourceEventsProps {
  schedulerData: SchedulerData;
  dndSource: DnDSource;
  resourceEvents: ResourceEvents;

  onSetAddMoreState?: (newState?: any) => void;
  updateEventStart?: (schedulerData: SchedulerData, event: Event, newStart: string) => any;
  updateEventEnd?: (schedulerData: SchedulerData, event: Event, newEnd: string) => any;
  moveEvent?: (
    schedulerData: SchedulerData,
    event: Event,
    slotId: string,
    slotName: string,
    start: string,
    end: string
  ) => void;
  movingEvent?: (
    schedulerData: SchedulerData,
    slotId: string,
    slotName: string,
    newStart: string,
    newEnd: string,
    action: any,
    type: string,
    item: RenderData
  ) => void;
  subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string;
  eventItemClick?: (schedulerData: SchedulerData, event: Event) => any;
  viewEventClick?: (schedulerData: SchedulerData, event: Event) => void;
  viewEventText?: string;
  viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void;
  viewEvent2Text?: string;
  newEvent?: (
    schedulerData: SchedulerData,
    slotId: string,
    slotName: string,
    startTime: string,
    endTime: string
  ) => any;
  eventItemTemplateResolver?: (
    schedulerData: SchedulerData,
    eventItem: Event,
    bgColor: string,
    isStart: boolean,
    isEnd: boolean,
    name: string,
    eventItemHeight: number,
    agendaMaxEventWidth: number
  ) => JSX.Element;
  conflictOccurred?: (
    schedulerData: SchedulerData,
    name: string,
    {},
    DnDTypes: string,
    slotId: string,
    slotName: string,
    startTime: string,
    endTime: string
  ) => void;
  // TODO
  connectDropTarget?: any;
}

interface ResourceEventsState {
  isSelecting: boolean;
  left: number;
  width: number;
  leftIndex?: number;
  rightIndex?: number;
  startX?: number;
}

class ResourceEvents extends Component<ResourceEventsProps, ResourceEventsState> {
  public eventContainer: any;
  public groupOnly: boolean;
  public headerItems: Header[];
  public slotId: string;
  public slotName: string;
  public hasSummary: boolean;
  public rowHeight: number;

  constructor(props: Readonly<ResourceEventsProps>) {
    super(props);

    this.state = {
      isSelecting: false,
      left: 0,
      width: 0,
    };
  }

  public componentDidMount() {
    const { schedulerData } = this.props;
    const { config } = schedulerData;
    if (config.creatable === true) {
      if (supportTouch) {
        // this.eventContainer.addEventListener('touchstart', this.initDrag, false);
      } else {
        this.eventContainer.addEventListener('mousedown', this.initDrag, false);
      }
    }
  }

  public componentWillReceiveProps(np: any) {
    if (supportTouch) {
      // this.eventContainer.removeEventListener('touchstart', this.initDrag, false);
    } else {
      this.eventContainer.removeEventListener('mousedown', this.initDrag, false);
    }
    if (np.schedulerData.config.creatable) {
      if (supportTouch) {
        // this.eventContainer.addEventListener('touchstart', this.initDrag, false);
      } else {
        this.eventContainer.addEventListener('mousedown', this.initDrag, false);
      }
    }
  }

  public initDrag = (ev: any) => {
    const { isSelecting } = this.state;
    if (isSelecting) {
      return;
    }
    if ((ev.srcElement || ev.target) !== this.eventContainer) {
      return;
    }

    ev.stopPropagation();

    const { resourceEvents } = this.props;
    if (resourceEvents.groupOnly) {
      return;
    }
    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length == 0) {
        return;
      }
      const touch = ev.changedTouches[0];
      clientX = touch.pageX;
    } else {
      if (ev.buttons !== undefined && ev.buttons !== 1) {
        return;
      }
      clientX = ev.clientX;
    }

    const { schedulerData } = this.props;
    const cellWidth = schedulerData.getContentCellWidth();
    const pos = getPos(this.eventContainer);
    const startX = clientX - pos.x;
    const leftIndex = Math.floor(startX / cellWidth);
    const left = leftIndex * cellWidth;
    const rightIndex = Math.ceil(startX / cellWidth);
    const width = (rightIndex - leftIndex) * cellWidth;

    this.setState({
      startX,
      left,
      leftIndex,
      width,
      rightIndex,
      isSelecting: true,
    });

    if (supportTouch) {
      document.documentElement.addEventListener('touchmove', this.doDrag, false);
      document.documentElement.addEventListener('touchend', this.stopDrag, false);
      document.documentElement.addEventListener('touchcancel', this.cancelDrag, false);
    } else {
      document.documentElement.addEventListener('mousemove', this.doDrag, false);
      document.documentElement.addEventListener('mouseup', this.stopDrag, false);
    }
    document.onselectstart = () => {
      return false;
    };
    document.ondragstart = () => {
      return false;
    };
  };

  public doDrag = (ev: any) => {
    ev.stopPropagation();

    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length == 0) {
        return;
      }
      const touch = ev.changedTouches[0];
      clientX = touch.pageX;
    } else {
      clientX = ev.clientX;
    }
    const { startX } = this.state;
    const { schedulerData } = this.props;
    const { headers } = schedulerData;
    const cellWidth = schedulerData.getContentCellWidth();
    const pos = getPos(this.eventContainer);
    const currentX = clientX - pos.x;
    let leftIndex = Math.floor(Math.min(startX, currentX) / cellWidth);
    leftIndex = leftIndex < 0 ? 0 : leftIndex;
    const left = leftIndex * cellWidth;
    let rightIndex = Math.ceil(Math.max(startX, currentX) / cellWidth);
    rightIndex = rightIndex > headers.length ? headers.length : rightIndex;
    const width = (rightIndex - leftIndex) * cellWidth;

    this.setState({
      leftIndex,
      left,
      rightIndex,
      width,
      isSelecting: true,
    });
  };

  public stopDrag = (ev: any) => {
    ev.stopPropagation();

    const { schedulerData, newEvent, resourceEvents } = this.props;
    const { headers, events, config, cellUnit } = schedulerData;
    const { leftIndex, rightIndex } = this.state;
    if (supportTouch) {
      document.documentElement.removeEventListener('touchmove', this.doDrag, false);
      document.documentElement.removeEventListener('touchend', this.stopDrag, false);
      document.documentElement.removeEventListener('touchcancel', this.cancelDrag, false);
    } else {
      document.documentElement.removeEventListener('mousemove', this.doDrag, false);
      document.documentElement.removeEventListener('mouseup', this.stopDrag, false);
    }
    document.onselectstart = null;
    document.ondragstart = null;

    const startTime = headers[leftIndex].time;
    let endTime = resourceEvents.headerItems[rightIndex - 1].end;
    if (cellUnit !== CellUnits.Hour) {
      endTime = moment(resourceEvents.headerItems[rightIndex - 1].start)
        .hour(23)
        .minute(59)
        .second(59)
        .format(DATETIME_FORMAT);
    }
    const slotId = resourceEvents.slotId;
    const slotName = resourceEvents.slotName;

    this.setState({
      startX: 0,
      leftIndex: 0,
      left: 0,
      rightIndex: 0,
      width: 0,
      isSelecting: false,
    });

    let hasConflict = false;
    if (config.checkConflict) {
      const start = moment(startTime);
      const end = moment(endTime);

      events.forEach((e) => {
        if (schedulerData.getEventSlotId(e) === slotId) {
          const eStart = moment(e.start);
          const eEnd = moment(e.end);
          if (
            (start >= eStart && start < eEnd) ||
            (end > eStart && end <= eEnd) ||
            (eStart >= start && eStart < end) ||
            (eEnd > start && eEnd <= end)
          ) {
            hasConflict = true;
          }
        }
      });
    }
    
    if (hasConflict) {
      const { conflictOccurred } = this.props;
      if (conflictOccurred != undefined) {
        conflictOccurred(
          schedulerData,
          'New',
          {
            id: undefined,
            start: startTime,
            end: endTime,
            slotId,
            slotName,
            title: undefined,
          },
          DnDTypes.EVENT,
          slotId,
          slotName,
          startTime,
          endTime
        );
      } else {
        console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
      }
    } else {
      if (newEvent != undefined) {
        newEvent(schedulerData, slotId, slotName, startTime, endTime);
      }
    }
  };

  public cancelDrag = (ev: any) => {
    ev.stopPropagation();

    const { isSelecting } = this.state;
    if (isSelecting) {
      document.documentElement.removeEventListener('touchmove', this.doDrag, false);
      document.documentElement.removeEventListener('touchend', this.stopDrag, false);
      document.documentElement.removeEventListener('touchcancel', this.cancelDrag, false);
      document.onselectstart = null;
      document.ondragstart = null;
      this.setState({
        startX: 0,
        leftIndex: 0,
        left: 0,
        rightIndex: 0,
        width: 0,
        isSelecting: false,
      });
    }
  };

  public render() {
    const { resourceEvents, schedulerData, connectDropTarget, dndSource } = this.props;
    const { cellUnit, startDate, endDate, config } = schedulerData;
    const { isSelecting, left, width } = this.state;
    const cellWidth = schedulerData.getContentCellWidth();
    const cellMaxEvents = schedulerData.getCellMaxEvents();
    const rowWidth = schedulerData.getContentTableWidth();
    const DnDEventItem = dndSource.getDragSource();

    const selectedArea = isSelecting ? <SelectedArea {...this.props} left={left} width={width} /> : <div />;

    const eventList = [];
    resourceEvents.headerItems.forEach((headerItem, index) => {
      if (headerItem.count > 0 || headerItem.summary != undefined) {
        const isTop =
          config.summaryPos === SummaryPos.TopRight ||
          config.summaryPos === SummaryPos.Top ||
          config.summaryPos === SummaryPos.TopLeft;
        const marginTop = resourceEvents.hasSummary && isTop ? 1 + config.eventItemLineHeight : 1;
        const renderEventsMaxIndex = headerItem.addMore === 0 ? cellMaxEvents : headerItem.addMoreIndex;

        headerItem.events.forEach((evt, idx) => {
          if (idx < renderEventsMaxIndex && evt !== undefined && evt.render) {
            let durationStart = moment(startDate);
            let durationEnd = moment(endDate).add(1, 'days');
            if (cellUnit === CellUnits.Hour) {
              durationStart = moment(startDate).add(config.dayStartFrom, 'hours');
              durationEnd = moment(endDate).add(config.dayStopTo + 1, 'hours');
            }
            const eventStart = moment(evt.eventItem.start);
            const eventEnd = moment(evt.eventItem.end);
            const isStart = eventStart >= durationStart;
            const isEnd = eventEnd <= durationEnd;
            const l = index * cellWidth + (index > 0 ? 2 : 3);
            const w = evt.span * cellWidth - (index > 0 ? 5 : 6) > 0 ? evt.span * cellWidth - (index > 0 ? 5 : 6) : 0;
            const top = marginTop + idx * config.eventItemLineHeight;
            const eventItem = (
              <DnDEventItem
                {...this.props}
                key={evt.eventItem.id}
                eventItem={evt.eventItem}
                isStart={isStart}
                isEnd={isEnd}
                isInPopover={false}
                left={l}
                width={w}
                top={top}
                leftIndex={index}
                rightIndex={index + evt.span}
              />
            );
            eventList.push(eventItem);
          }
        });

        if (headerItem.addMore > 0) {
          const l = index * cellWidth + (index > 0 ? 2 : 3);
          const w = cellWidth - (index > 0 ? 5 : 6);
          const top = marginTop + headerItem.addMoreIndex * config.eventItemLineHeight;
          const addMoreItem = (
            <AddMore
              {...this.props}
              key={headerItem.time}
              headerItem={headerItem}
              number={headerItem.addMore}
              left={l}
              width={w}
              top={top}
              clickAction={this.onAddMoreClick}
            />
          );
          eventList.push(addMoreItem);
        }

        if (headerItem.summary != undefined) {
          const top = isTop ? 1 : resourceEvents.rowHeight - config.eventItemLineHeight + 1;
          const l = index * cellWidth + (index > 0 ? 2 : 3);
          const w = cellWidth - (index > 0 ? 5 : 6);
          const key = `${resourceEvents.slotId}_${headerItem.time}`;
          const summary = (
            <Summary
              key={key}
              schedulerData={schedulerData}
              summary={headerItem.summary}
              left={l}
              width={w}
              top={top}
            />
          );
          eventList.push(summary);
        }
      }
    });

    return (
      <tr>
        <td style={{ width: rowWidth }}>
          {connectDropTarget(
            <div ref={this.eventContainerRef} className="event-container" style={{ height: resourceEvents.rowHeight }}>
              {selectedArea}
              {eventList}
            </div>
          )}
        </td>
      </tr>
    );
  }

  public onAddMoreClick = (headerItem: Header) => {
    const { onSetAddMoreState, resourceEvents, schedulerData } = this.props;
    if (!!onSetAddMoreState) {
      const { config } = schedulerData;
      const cellWidth = schedulerData.getContentCellWidth();
      const index = resourceEvents.headerItems.indexOf(headerItem);
      if (index !== -1) {
        let left = index * (cellWidth - 1);
        const pos = getPos(this.eventContainer);
        left = left + pos.x;
        const top = pos.y;
        const height = (headerItem.count + 1) * config.eventItemLineHeight + 20;

        onSetAddMoreState({
          headerItem,
          left,
          top,
          height,
        });
      }
    }
  };

  public eventContainerRef = (element: any) => {
    this.eventContainer = element;
  };
}

export default ResourceEvents;
