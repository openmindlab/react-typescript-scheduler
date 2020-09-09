import { SchedulerData, SchedulerViewTypes, SchedulerEvent, SchedulerContentState } from '../lib';
import { DemoData } from './DemoData';

export const getNow = (): string => {
  // moment().format(SCHEDULER_DATE_FORMAT)
  return '2017-12-18';
};

export function prevClick(schedulerData: SchedulerData) {
  schedulerData.prev();
  schedulerData.setEvents(DemoData.events);
  this.setState({
    viewModel: schedulerData,
  });
}

export function toggleExpandFunc(schedulerData: SchedulerData, slotId: string) {
  schedulerData.toggleExpandStatus(slotId);
  this.setState({
    viewModel: schedulerData,
  });
}

export function nextClick(schedulerData: SchedulerData) {
  schedulerData.next();
  schedulerData.setEvents(DemoData.events);
  this.setState({
    viewModel: schedulerData,
  });
}

export function onViewChange(
  schedulerData: SchedulerData,
  view: { viewType: any; showAgenda: any; isEventPerspective: any }
) {
  schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
  schedulerData.setEvents(DemoData.events);
  this.setState({
    viewModel: schedulerData,
  });
}

export function onSelectDate(schedulerData: SchedulerData, date: string) {
  schedulerData.setDate(date);
  schedulerData.setEvents(DemoData.events);
  this.setState({
    viewModel: schedulerData,
  });
}

export function eventClicked(schedulerData: SchedulerData, event: SchedulerEvent) {
  alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
}

export function ops1(schedulerData: SchedulerData, event: SchedulerEvent) {
  alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
}

export function ops2(schedulerData: SchedulerData, event: SchedulerEvent) {
  alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
}

export function newEvent(
  schedulerData: SchedulerData,
  slotId: string,
  slotName: string,
  start: string,
  end: string,
  type: string,
  item: SchedulerEvent
) {
  if (
    confirm(
      `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
    )
  ) {
    let newFreshId = '0';
    schedulerData.events.forEach((i) => {
      if (i.id >= newFreshId) {
        newFreshId = i.id + 1;
      }
    });

    const newE = {
      id: newFreshId,
      title: 'New event you just created',
      start,
      end,
      resourceId: slotId,
      bgColor: 'purple',
    };
    schedulerData.addEvent(newE);
    this.setState({
      viewModel: schedulerData,
    });
  }
}

export function updateEventStart(schedulerData: SchedulerData, event: SchedulerEvent, newStart: string) {
  if (
    confirm(
      `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`
    )
  ) {
    schedulerData.updateEventStart(event, newStart);
  }
  this.setState({
    viewModel: schedulerData,
  });
}

export function updateEventEnd(schedulerData: SchedulerData, event: SchedulerEvent, newEnd: string) {
  if (
    confirm(
      `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`
    )
  ) {
    schedulerData.updateEventEnd(event, newEnd);
  }
  this.setState({
    viewModel: schedulerData,
  });
}

export function moveEvent(
  schedulerData: SchedulerData,
  event: SchedulerEvent,
  slotId: string,
  slotName: string,
  start: string,
  end: string
) {
  if (
    confirm(
      `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
    )
  ) {
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    this.setState({
      viewModel: schedulerData,
    });
  }
}

export function onSetAddMoreState(newState: any) {
  if (newState === undefined) {
    this.setState({
      headerItem: undefined,
      left: 0,
      top: 0,
      height: 0,
    });
  } else {
    this.setState({
      ...newState,
    });
  }
}

export function onScrollRight(
  schedulerData: SchedulerData,
  schedulerContent: SchedulerContentState,
  maxScrollLeft: number
) {
  if (schedulerData.viewType === SchedulerViewTypes.Day) {
    schedulerData.next();
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData,
    });

    schedulerContent.scrollLeft = maxScrollLeft - 10;
  }
}

export function onScrollLeft(
  schedulerData: SchedulerData,
  schedulerContent: SchedulerContentState,
  maxScrollLeft: number
) {
  if (schedulerData.viewType === SchedulerViewTypes.Day) {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData,
    });

    schedulerContent.scrollLeft = 10;
  }
}

export function onScrollTop(
  schedulerData: SchedulerData,
  schedulerContent: SchedulerContentState,
  maxScrollLeft: number
) {
  console.log('onScrollTop');
}

export function onScrollBottom(
  schedulerData: SchedulerData,
  schedulerContent: SchedulerContentState,
  maxScrollLeft: number
) {
  console.log('onScrollBottom');
}

export function conflictOccurred(
  schedulerData: SchedulerData,
  action: string,
  event: SchedulerEvent,
  type: string,
  slotId: string,
  slotName: string,
  start: string,
  end: string
) {
  alert(`Conflict occurred. {action: ${action}, event: ${event}`);
}
