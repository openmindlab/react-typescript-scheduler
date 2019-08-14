import {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerEvent,
    SchedulerContentState,
    MoveEventArgs,
    NewEventArgs,
    ConflictOccurredArgs,
} from "../../src/Scheduler";
import { DemoData } from "./DemoData";
import moment = require("moment");

export const getNow = (): moment.Moment => {
    return moment("2017-12-18");
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

export function onViewChange(schedulerData: SchedulerData, view: { viewType: any; showAgenda: any; isEventPerspective: any; }) {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(DemoData.events);
    this.setState({
        viewModel: schedulerData,
    });
}

export function onSelectDate(schedulerData: SchedulerData, date: moment.Moment) {
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

export function newEvent(args: NewEventArgs) {
    if (confirm(`Do you want to create a new event? {slotId: ${args.slotId}, slotName: ${args.slotName}, start: ${args.start}, end: ${args.end}, type: ${args.type}, item: ${args.item}}`)) {

        let newFreshId = "0";
        args.schedulerData.events.forEach((i) => {
            if (i.id >= newFreshId) {
                newFreshId = i.id + 1;
            }
        });

        const newE = {
            id: newFreshId,
            title: "New event you just created",
            start: args.start,
            end: args.end,
            resourceId: args.slotId,
            bgColor: "purple",
        };
        args.schedulerData.addEvent(newE);
        this.setState({
            viewModel: args.schedulerData,
        });
    }
}

export function updateEventStart(schedulerData: SchedulerData, event: SchedulerEvent, newStart: moment.Moment) {
    if (confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
        schedulerData.updateEventStart(event, newStart);
    }
    this.setState({
        viewModel: schedulerData,
    });
}

export function updateEventEnd(schedulerData: SchedulerData, event: SchedulerEvent, newEnd: moment.Moment) {
    if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
        schedulerData.updateEventEnd(event, newEnd);
    }
    this.setState({
        viewModel: schedulerData,
    });
}

export function moveEvent(args: MoveEventArgs) {
    if (confirm(`Do you want to move the event? {eventId: ${args.event.id}, eventTitle: ${args.event.title}, newSlotId: ${args.slotId}, newSlotName: ${args.slotName}, newStart: ${args.start}, newEnd: ${args.end}`)) {
        args.schedulerData.moveEvent(args.event, args.slotId, args.slotName, args.start, args.end);
        this.setState({
            viewModel: args.schedulerData,
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

export function onScrollRight(schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) {
    if (schedulerData.viewType === SchedulerViewTypes.Day) {
        schedulerData.next();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });

        schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
}

export function onScrollLeft(schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) {
    if (schedulerData.viewType === SchedulerViewTypes.Day) {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });

        schedulerContent.scrollLeft = 10;
    }
}

export function onScrollTop(schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) {
    console.log("onScrollTop");
}

export function onScrollBottom(schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) {
    console.log("onScrollBottom");
}

export function conflictOccurred(args: ConflictOccurredArgs) {
    alert(`Conflict occurred. {action: ${args.action}, event: ${args.event}`);
}
