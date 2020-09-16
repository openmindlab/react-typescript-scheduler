import * as React from 'react';
import moment from 'moment';
import { Component, CSSProperties } from 'react';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import EventItemPopover from './EventItemPopover';
import { CellUnits } from './types/CellUnits';
import { DATETIME_FORMAT } from './types/DateFormats';
import { DnDTypes } from './types/DnDTypes';
import { SchedulerData } from './Scheduler';
import { Event } from './SchedulerData';

const supportTouch = 'ontouchstart' in window;
interface EventItemProps {
  schedulerData: SchedulerData;
  eventItem: any;
  isStart: boolean;
  isEnd: boolean;
  left: number;
  width: number;
  top: number;
  isInPopover: boolean;
  leftIndex: number;
  rightIndex: number;
  isDragging: boolean;
  connectDragSource: (action: any) => any;
  connectDragPreview: (action: any) => any;
  updateEventStart?: (schedulerData: SchedulerData, eventItem: Event, newStart: string) => any;
  updateEventEnd?: (schedulerData: SchedulerData, eventItem: Event, newEnd: string) => any;
  moveEvent?: (
    schedulerData: SchedulerData,
    event: Event,
    slotId: string,
    slotName: string,
    start: string,
    end: string
  ) => void;
  eventItemClick: (schedulerData: SchedulerData, eventItem: Event) => any;
  conflictOccurred?: (
    schedulerData: SchedulerData,
    name: string,
    evI: EventItem,
    ev: any,
    slotId: string,
    slotName: string,
    newStart: string,
    evItEnd: any
  ) => any;
  subtitleGetter?: (schedulerData: SchedulerData, eventItem: Event) => string;
  viewEventClick?: (schedulerData: SchedulerData, eventItem: Event) => any;
  viewEventText?: string;
  viewEvent2Click?: (schedulerData: SchedulerData, eventItem: Event) => any;
  viewEvent2Text?: string;
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
}
interface EventItemState {
  left: number;
  top: number;
  width: number;
  startX?: number;
  endX?: number;
}
class EventItem extends Component<EventItemProps, EventItemState> {
  private startResizer: any;
  private endResizer: any;
  constructor(props: Readonly<EventItemProps>) {
    super(props);

    const { left, top, width } = props;
    this.state = {
      left,
      top,
      width,
    };
    this.startResizer = null;
    this.endResizer = null;
  }

  public componentWillReceiveProps(np: any) {
    const { left, top, width } = np;
    this.setState({
      left,
      top,
      width,
    });

    this.subscribeResizeEvent(np);
  }

  public componentDidMount() {
    this.subscribeResizeEvent(this.props);
  }

  public initStartDrag = (ev: any) => {
    const { schedulerData, eventItem } = this.props;
    const slotId = schedulerData.getEventSlotId(eventItem);
    const slot = schedulerData.getSlotById(slotId);
    if (!!slot && !!slot.groupOnly) {
      return;
    }
    if (schedulerData.isResizing()) {
      return;
    }

    ev.stopPropagation();
    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length === 0) {
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
    this.setState({
      startX: clientX,
    });
    schedulerData.startResizing();
    if (supportTouch) {
      this.startResizer.addEventListener('touchmove', this.doStartDrag, false);
      this.startResizer.addEventListener('touchend', this.stopStartDrag, false);
      this.startResizer.addEventListener('touchcancel', this.cancelStartDrag, false);
    } else {
      document.documentElement.addEventListener('mousemove', this.doStartDrag, false);
      document.documentElement.addEventListener('mouseup', this.stopStartDrag, false);
    }
    document.onselectstart = () => {
      return false;
    };
    document.ondragstart = () => {
      return false;
    };
  };

  public doStartDrag = (ev: any) => {
    ev.stopPropagation();

    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length === 0) {
        return;
      }
      const touch = ev.changedTouches[0];
      clientX = touch.pageX;
    } else {
      clientX = ev.clientX;
    }
    const { left, width, leftIndex, rightIndex, schedulerData } = this.props;
    const cellWidth = schedulerData.getContentCellWidth();
    const offset = leftIndex > 0 ? 5 : 6;
    const minWidth = cellWidth - offset;
    const maxWidth = rightIndex * cellWidth - offset;
    const { startX } = this.state;
    let newLeft = left + clientX - startX;
    let newWidth = width + startX - clientX;
    if (newWidth < minWidth) {
      newWidth = minWidth;
      newLeft = (rightIndex - 1) * cellWidth + (rightIndex - 1 > 0 ? 2 : 3);
    } else if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newLeft = 3;
    }

    this.setState({ left: newLeft, width: newWidth });
  };

  public stopStartDrag = (ev: any) => {
    ev.stopPropagation();
    if (supportTouch) {
      this.startResizer.removeEventListener('touchmove', this.doStartDrag, false);
      this.startResizer.removeEventListener('touchend', this.stopStartDrag, false);
      this.startResizer.removeEventListener('touchcancel', this.cancelStartDrag, false);
    } else {
      document.documentElement.removeEventListener('mousemove', this.doStartDrag, false);
      document.documentElement.removeEventListener('mouseup', this.stopStartDrag, false);
    }
    document.onselectstart = null;
    document.ondragstart = null;
    const {
      width,
      left,
      top,
      leftIndex,
      rightIndex,
      schedulerData,
      eventItem,
      updateEventStart,
      conflictOccurred,
    } = this.props;
    schedulerData.stopResizing();
    if (this.state.width === width) {
      return;
    }

    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length === 0) {
        this.setState({
          left,
          top,
          width,
        });
        return;
      }
      const touch = ev.changedTouches[0];
      clientX = touch.pageX;
    } else {
      clientX = ev.clientX;
    }
    const { cellUnit, events, config } = schedulerData;
    const cellWidth = schedulerData.getContentCellWidth();
    const offset = leftIndex > 0 ? 5 : 6;
    const minWidth = cellWidth - offset;
    const maxWidth = rightIndex * cellWidth - offset;
    const { startX } = this.state;
    const newWidth = width + startX - clientX;
    const deltaX = clientX - startX;
    const sign = deltaX < 0 ? -1 : deltaX === 0 ? 0 : 1;
    let count = (sign > 0 ? Math.floor(Math.abs(deltaX) / cellWidth) : Math.ceil(Math.abs(deltaX) / cellWidth)) * sign;
    if (newWidth < minWidth) {
      count = rightIndex - leftIndex - 1;
    } else if (newWidth > maxWidth) {
      count = -leftIndex;
    }
    let newStart = moment(eventItem.start)
      .add(
        cellUnit === CellUnits.Hour ? count * config.minuteStep : count,
        cellUnit === CellUnits.Hour ? 'minutes' : 'days'
      )
      .format(DATETIME_FORMAT);
    if (count !== 0 && cellUnit !== CellUnits.Hour && config.displayWeekend === false) {
      if (count > 0) {
        let tempCount = 0;
        let i = 0;
        while (true) {
          i++;
          const tempStart = moment(eventItem.start).add(i, 'days');
          const dayOfWeek = tempStart.weekday();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            tempCount++;
            if (tempCount === count) {
              newStart = tempStart.format(DATETIME_FORMAT);
              break;
            }
          }
        }
      } else {
        let tempCount = 0;
        let i = 0;
        while (true) {
          i--;
          const tempStart = moment(eventItem.start).add(i, 'days');
          const dayOfWeek = tempStart.weekday();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            tempCount--;
            if (tempCount === count) {
              newStart = tempStart.format(DATETIME_FORMAT);
              break;
            }
          }
        }
      }
    }

    let hasConflict = false;
    let conflictingEvents = [];
    const slotId = schedulerData.getEventSlotId(eventItem);
    const slot = schedulerData.getSlotById(slotId);
    let slotName;
    if (!!slot) {
      slotName = slot.name;
    }
    if (config.checkConflict) {
      const start = moment(newStart);
      const end = moment(eventItem.end);

      events.forEach((e) => {
        if (schedulerData.getEventSlotId(e) === slotId && e.id !== eventItem.id) {
          const eStart = moment(e.start);
          const eEnd = moment(e.end);
          if (
            (start >= eStart && start < eEnd) ||
            (end > eStart && end <= eEnd) ||
            (eStart >= start && eStart < end) ||
            (eEnd > start && eEnd <= end)
          ) {
            conflictingEvents.push(e)
            hasConflict = true;
          }
        }
      });
    }
    const passMax = conflictingEvents.length >= slot.maxItemsPerDay - 1
    if (hasConflict && passMax) {
      this.setState({
        left,
        top,
        width,
      });
      //Resizing Conflict Check
      if (conflictOccurred != undefined) {
        conflictOccurred(
          schedulerData,
          'StartResize',
          eventItem,
          DnDTypes.EVENT,
          slotId,
          slotName,
          newStart,
          eventItem.end
        );
      } else {
        console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
      }
      this.subscribeResizeEvent(this.props);
    } else {
      if (updateEventStart != undefined) {
        updateEventStart(schedulerData, eventItem, newStart);
      }
    }
  };

  public cancelStartDrag = (ev: any) => {
    ev.stopPropagation();

    this.startResizer.removeEventListener('touchmove', this.doStartDrag, false);
    this.startResizer.removeEventListener('touchend', this.stopStartDrag, false);
    this.startResizer.removeEventListener('touchcancel', this.cancelStartDrag, false);
    document.onselectstart = null;
    document.ondragstart = null;
    const { schedulerData, left, top, width } = this.props;
    schedulerData.stopResizing();
    this.setState({
      left,
      top,
      width,
    });
  };

  public initEndDrag = (ev: any) => {
    const { schedulerData, eventItem } = this.props;
    const slotId = schedulerData.getEventSlotId(eventItem);
    const slot = schedulerData.getSlotById(slotId);
    if (!!slot && !!slot.groupOnly) {
      return;
    }
    if (schedulerData.isResizing()) {
      return;
    }

    ev.stopPropagation();
    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length === 0) {
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
    this.setState({
      endX: clientX,
    });

    schedulerData.startResizing();
    if (supportTouch) {
      this.endResizer.addEventListener('touchmove', this.doEndDrag, false);
      this.endResizer.addEventListener('touchend', this.stopEndDrag, false);
      this.endResizer.addEventListener('touchcancel', this.cancelEndDrag, false);
    } else {
      document.documentElement.addEventListener('mousemove', this.doEndDrag, false);
      document.documentElement.addEventListener('mouseup', this.stopEndDrag, false);
    }
    document.onselectstart = () => {
      return false;
    };
    document.ondragstart = () => {
      return false;
    };
  };

  public doEndDrag = (ev: any) => {
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
    const { width, leftIndex, schedulerData } = this.props;
    const { headers } = schedulerData;
    const cellWidth = schedulerData.getContentCellWidth();
    const offset = leftIndex > 0 ? 5 : 6;
    const minWidth = cellWidth - offset;
    const maxWidth = (headers.length - leftIndex) * cellWidth - offset;
    const { endX } = this.state;

    let newWidth = width + clientX - endX;
    if (newWidth < minWidth) {
      newWidth = minWidth;
    } else if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }

    this.setState({ width: newWidth });
  };

  public stopEndDrag = (ev: any) => {
    ev.stopPropagation();

    if (supportTouch) {
      this.endResizer.removeEventListener('touchmove', this.doEndDrag, false);
      this.endResizer.removeEventListener('touchend', this.stopEndDrag, false);
      this.endResizer.removeEventListener('touchcancel', this.cancelEndDrag, false);
    } else {
      document.documentElement.removeEventListener('mousemove', this.doEndDrag, false);
      document.documentElement.removeEventListener('mouseup', this.stopEndDrag, false);
    }
    document.onselectstart = null;
    document.ondragstart = null;
    const {
      width,
      left,
      top,
      leftIndex,
      rightIndex,
      schedulerData,
      eventItem,
      updateEventEnd,
      conflictOccurred,
    } = this.props;
    schedulerData.stopResizing();
    if (this.state.width === width) {
      return;
    }

    let clientX = 0;
    if (supportTouch) {
      if (ev.changedTouches.length == 0) {
        this.setState({
          left,
          top,
          width,
        });
        return;
      }
      const touch = ev.changedTouches[0];
      clientX = touch.pageX;
    } else {
      clientX = ev.clientX;
    }
    const { headers, cellUnit, events, config } = schedulerData;
    const cellWidth = schedulerData.getContentCellWidth();
    const offset = leftIndex > 0 ? 5 : 6;
    const minWidth = cellWidth - offset;
    const maxWidth = (headers.length - leftIndex) * cellWidth - offset;
    const { endX } = this.state;

    const newWidth = width + clientX - endX;
    const deltaX = newWidth - width;
    const sign = deltaX < 0 ? -1 : deltaX === 0 ? 0 : 1;
    let count = (sign < 0 ? Math.floor(Math.abs(deltaX) / cellWidth) : Math.ceil(Math.abs(deltaX) / cellWidth)) * sign;
    if (newWidth < minWidth) {
      count = leftIndex - rightIndex + 1;
    } else if (newWidth > maxWidth) {
      count = headers.length - rightIndex;
    }
    let newEnd = moment(eventItem.end)
      .add(
        cellUnit === CellUnits.Hour ? count * config.minuteStep : count,
        cellUnit === CellUnits.Hour ? 'minutes' : 'days'
      )
      .format(DATETIME_FORMAT);
    if (count !== 0 && cellUnit !== CellUnits.Hour && config.displayWeekend === false) {
      let tempCount = 0;
      let i = 0;
      if (count > 0) {
        while (true) {
          i++;
          const tempEnd = moment(eventItem.end).add(i, 'days');
          const dayOfWeek = tempEnd.weekday();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            tempCount++;
            if (tempCount === count) {
              newEnd = tempEnd.format(DATETIME_FORMAT);
              break;
            }
          }
        }
      } else {
        while (true) {
          i--;
          const tempEnd = moment(eventItem.end).add(i, 'days');
          const dayOfWeek = tempEnd.weekday();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            tempCount--;
            if (tempCount === count) {
              newEnd = tempEnd.format(DATETIME_FORMAT);
              break;
            }
          }
        }
      }
    }

    let hasConflict = false;
    let conflictingEvents = [];
    const slotId = schedulerData.getEventSlotId(eventItem);
    const slot = schedulerData.getSlotById(slotId);
    let slotName;
    if (!!slot) {
      slotName = slot.name;
    }
    if (config.checkConflict) {
      const start = moment(eventItem.start);
      const end = moment(newEnd);

      events.forEach((e) => {
        if (schedulerData.getEventSlotId(e) === slotId && e.id !== eventItem.id) {
          const eStart = moment(e.start);
          const eEnd = moment(e.end);
          if (
            (start >= eStart && start < eEnd) ||
            (end > eStart && end <= eEnd) ||
            (eStart >= start && eStart < end) ||
            (eEnd > start && eEnd <= end)
          ) {
            conflictingEvents.push(e)
            hasConflict = true;
          }
        }
      });
    }
    const passMax = conflictingEvents.length >= slot.maxItemsPerDay - 1
    if (hasConflict && passMax) {
      this.setState({
        left,
        top,
        width,
      });

      if (conflictOccurred != undefined) {
        conflictOccurred(
          schedulerData,
          'EndResize',
          eventItem,
          DnDTypes.EVENT,
          slotId,
          slotName,
          eventItem.start,
          newEnd
        );
      } else {
        console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
      }
      this.subscribeResizeEvent(this.props);
    } else {
      if (updateEventEnd != undefined) {
        updateEventEnd(schedulerData, eventItem, newEnd);
      }
    }
  };

  public cancelEndDrag = (ev: any) => {
    ev.stopPropagation();

    this.endResizer.removeEventListener('touchmove', this.doEndDrag, false);
    this.endResizer.removeEventListener('touchend', this.stopEndDrag, false);
    this.endResizer.removeEventListener('touchcancel', this.cancelEndDrag, false);
    document.onselectstart = null;
    document.ondragstart = null;
    const { schedulerData, left, top, width } = this.props;
    schedulerData.stopResizing();
    this.setState({
      left,
      top,
      width,
    });
  };

  public render() {
    const {
      eventItem,
      isStart,
      isEnd,
      isInPopover,
      eventItemClick,
      schedulerData,
      isDragging,
      connectDragSource,
      connectDragPreview,
      eventItemTemplateResolver,
    } = this.props;
    const { config } = schedulerData;
    const { left, width, top } = this.state;
    const roundCls = isStart ? (isEnd ? 'round-all' : 'round-head') : isEnd ? 'round-tail' : 'round-none';
    let bgColor = config.defaultEventBgColor;
    if (!!eventItem.bgColor) {
      bgColor = eventItem.bgColor;
    }

    const titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, eventItem);
    const content = (
      <EventItemPopover
        {...this.props}
        eventItem={eventItem}
        title={eventItem.title}
        startTime={eventItem.start}
        endTime={eventItem.end}
        statusColor={bgColor}
      />
    );

    const start = moment(eventItem.start);
    const eventTitle = isInPopover ? `${start.format('HH:mm')} ${titleText}` : titleText;
    let startResizeDiv = <div />;
    if (this.startResizable(this.props)) {
      startResizeDiv = (
        <div className="event-resizer event-start-resizer" ref={(ref) => (this.startResizer = ref)}></div>
      );
    }
    let endResizeDiv = <div />;
    if (this.endResizable(this.props)) {
      endResizeDiv = <div className="event-resizer event-end-resizer" ref={(ref) => (this.endResizer = ref)}></div>;
    }

    let eventItemTemplate = (
      <div
        className={roundCls + ' event-item'}
        key={eventItem.id}
        style={{ height: config.eventItemHeight, backgroundColor: bgColor }}
      >
        <span style={{ marginLeft: '10px', lineHeight: `${config.eventItemHeight}px` }}>{eventTitle}</span>
      </div>
    );
    if (eventItemTemplateResolver != undefined) {
      eventItemTemplate = eventItemTemplateResolver(
        schedulerData,
        eventItem,
        bgColor,
        isStart,
        isEnd,
        'event-item',
        config.eventItemHeight,
        undefined
      );
    }

    const a = (
      <a
        className="timeline-event"
        style={{ left, width, top }}
        onClick={() => {
          if (!!eventItemClick) {
            eventItemClick(schedulerData, eventItem);
          }
        }}
      >
        {eventItemTemplate}
        {startResizeDiv}
        {endResizeDiv}
      </a>
    );

    return isDragging ? null : schedulerData.isResizing() ||
      config.eventItemPopoverEnabled === false ||
      eventItem.showPopover === false ? (
      <div>{connectDragPreview(connectDragSource(a))}</div>
    ) : (
      <Popover placement="bottomLeft" content={content} trigger="hover">
        {connectDragPreview(connectDragSource(a))}
      </Popover>
    );
  }

  public startResizable = (props: { eventItem: Event; isInPopover: boolean; schedulerData: SchedulerData }) => {
    const { eventItem, isInPopover, schedulerData } = props;
    const { config } = schedulerData;
    return (
      config.startResizable === true &&
      isInPopover === false &&
      (eventItem.resizable == undefined || eventItem.resizable !== false) &&
      (eventItem.startResizable == undefined || eventItem.startResizable !== false)
    );
  };

  public endResizable = (props: { eventItem: Event; isInPopover: boolean; schedulerData: SchedulerData }) => {
    const { eventItem, isInPopover, schedulerData } = props;
    const { config } = schedulerData;
    return (
      config.endResizable === true &&
      isInPopover === false &&
      (eventItem.resizable == undefined || eventItem.resizable !== false) &&
      (eventItem.endResizable == undefined || eventItem.endResizable !== false)
    );
  };

  public subscribeResizeEvent = (props: { eventItem: Event; isInPopover: boolean; schedulerData: SchedulerData }) => {
    if (this.startResizer != undefined) {
      if (supportTouch) {
        // this.startResizer.removeEventListener('touchstart', this.initStartDrag, false);
        // if (this.startResizable(props))
        //     this.startResizer.addEventListener('touchstart', this.initStartDrag, false);
      } else {
        this.startResizer.removeEventListener('mousedown', this.initStartDrag, false);
        if (this.startResizable(props)) {
          this.startResizer.addEventListener('mousedown', this.initStartDrag, false);
        }
      }
    }
    if (this.endResizer != undefined) {
      if (supportTouch) {
        // this.endResizer.removeEventListener('touchstart', this.initEndDrag, false);
        // if (this.endResizable(props))
        //     this.endResizer.addEventListener('touchstart', this.initEndDrag, false);
      } else {
        this.endResizer.removeEventListener('mousedown', this.initEndDrag, false);
        if (this.endResizable(props)) {
          this.endResizer.addEventListener('mousedown', this.initEndDrag, false);
        }
      }
    }
  };
}

export default EventItem;
