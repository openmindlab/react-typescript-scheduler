import * as moment from "moment";
import {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerContentState,
    MoveEventArgs,
    NewEventArgs,
    ConflictOccurredArgs,
    OnViewChangeArgs,
    UpdateEventEndArgs,
    UpdateEventStartArgs,
    EventActionFuncArgs,
    OnSelectDateArgs,
} from "../../src/Scheduler";
import { DemoData } from "./DemoData";

export function updateSchedulerDataState(sd?: SchedulerData) {
    this.setState({
        viewModel: sd ? sd : this.viewModel,
        update: moment.now(),
    });
}

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

export function nextClick(schedulerData: SchedulerData) {
    schedulerData.next();
    schedulerData.setEvents(DemoData.events);
    this.setState({
        viewModel: schedulerData,
    });
}

export function onViewChange(args: OnViewChangeArgs) {
    args.schedulerData.setViewType(args.view.viewType, args.view.showAgenda, args.view.isEventPerspective);
    args.schedulerData.setEvents(DemoData.events);
    this.setState({
        viewModel: args.schedulerData,
    });
}

export function onSelectDate(args: OnSelectDateArgs) {
    args.schedulerData.setDate(args.date);
    args.schedulerData.setEvents(DemoData.events);
    this.setState({
        viewModel: args.schedulerData,
    });
}

export function eventClicked(args: EventActionFuncArgs) {
    alert(`You just clicked an event: {id: ${args.event.id}, title: ${args.event.title}}`);
}

export function ops1(args: EventActionFuncArgs) {
    alert(`You just executed ops1 to event: {id: ${args.event.id}, title: ${args.event.title}}`);
}

export function ops2(args: EventActionFuncArgs) {
    alert(`You just executed ops2 to event: {id: ${args.event.id}, title: ${args.event.title}}`);
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

export function updateEventStart(args: UpdateEventStartArgs) {
    if (confirm(`Do you want to adjust the start of the event? {eventId: ${args.event.id}, eventTitle: ${args.event.title}, newStart: ${args.newStart.format()}}`)) {
        args.schedulerData.updateEventStart(args.event, args.newStart);
    }
    this.setState({
        viewModel: args.schedulerData,
    });
}

export function updateEventEnd(args: UpdateEventEndArgs) {
    if (confirm(`Do you want to adjust the end of the event? {eventId: ${args.event.id}, eventTitle: ${args.event.title}, newEnd: ${args.newEnd.format()}}`)) {
        args.schedulerData.updateEventEnd(args.event, args.newEnd);
    }
    this.setState({
        viewModel: args.schedulerData,
    });
}

export function moveEvent(args: MoveEventArgs) {
    if (confirm(`Do you want to move the event? {eventId: ${args.event.id}, eventTitle: ${args.event.title}, newSlotId: ${args.slotId}, newSlotName: ${args.slotName}, newStart: ${args.start.format()}, newEnd: ${args.end.format()}`)) {
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
