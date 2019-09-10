import { DragSource, DragSourceMonitor } from "react-dnd";
import * as moment from "moment";
import { DnDTypes } from "./types/DnDTypes";
import { ViewTypes } from "./types/ViewTypes";
import { SchedulerData, MoveEventArgs, NewEventArgs, ConflictOccurredArgs } from "./Scheduler";
import ResourceEvents from "./ResourceEvents";
import { Event } from "./SchedulerData";

/**
 * Datetime
 */
export default class DnDSource {
    public resolveDragObjFunc: (props: any) => any;
    public DecoratedComponent: any;
    public dndType: DnDTypes;
    public dragSource: any;
    constructor(resolveDragObjFunc: any, DecoratedComponent: any, dndType: DnDTypes = DnDTypes.EVENT) {
        this.resolveDragObjFunc = resolveDragObjFunc;
        this.DecoratedComponent = DecoratedComponent;
        this.dndType = dndType;
        this.dragSource = DragSource(this.dndType, this.getDragSpec(), this.getDragCollect)(this.DecoratedComponent);
    }

    public getDragSpec = () => {
        return {
            beginDrag: (props: any, monitor: DragSourceMonitor, component: any) => {
                return this.resolveDragObjFunc(props);
            },
            endDrag: (
                props: {
                    schedulerData: SchedulerData,
                    moveEvent: (args: MoveEventArgs) => void,
                    newEvent: (args: NewEventArgs) => void,
                    conflictOccurred?: (args: ConflictOccurredArgs) => void,
                },
                monitor: DragSourceMonitor, component: any,
            ) => {
                if (!monitor.didDrop()) { return; }

                const { moveEvent, newEvent, schedulerData } = props;
                const { events, config, viewType } = schedulerData;
                const item = monitor.getItem();
                const type: string = monitor.getItemType().toString();
                const dropResult = monitor.getDropResult();
                let slotId = dropResult.slotId;
                let slotName = dropResult.slotName;
                let newStart = moment(dropResult.start);
                let newEnd = moment(dropResult.end);
                const initialStart = moment(dropResult.initialStart);
                // const initialEnd = moment(dropResult.initialEnd);
                let action = "New";

                const isEvent = type === DnDTypes.EVENT;
                if (isEvent) {
                    const event = item;
                    if (config.relativeMove) {
                        newStart = moment(event.start).add(moment(newStart).diff(moment(initialStart)), "ms");
                    } else {
                        if (viewType !== ViewTypes.Day) {
                            const tmpMoment = newStart;
                            newStart = moment(event.start).year(tmpMoment.year()).month(tmpMoment.month()).date(tmpMoment.date());
                        }
                    }
                    newEnd = moment(newStart).add(moment(event.end).diff(moment(event.start)), "ms");

                    // if crossResourceMove disabled, slot returns old value
                    if (config.crossResourceMove === false) {
                        slotId = schedulerData.getEventSlotId(item);
                        slotName = undefined;
                        const slot = schedulerData.getSlotById(slotId);
                        if (!!slot) {
                            slotName = slot.name;
                        }
                    }

                    action = "Move";
                }

                let hasConflict = false;
                if (config.checkConflict) {
                    const start = newStart;
                    const end = newEnd;

                    events.forEach((e: any) => {
                        if (schedulerData.getEventSlotId(e) === slotId && (!isEvent || e.id !== item.id)) {
                            const eStart = moment(e.start);
                            const eEnd = moment(e.end);
                            if ((start >= eStart && start < eEnd) || (end > eStart && end <= eEnd) || (eStart >= start && eStart < end) || (eEnd > start && eEnd <= end)) {
                                hasConflict = true;
                            }
                        }
                    });
                }

                if (hasConflict) {
                    const { conflictOccurred } = props;
                    if (conflictOccurred != undefined) {
                        conflictOccurred({
                            schedulerData,
                            action,
                            event: item,
                            type: DnDTypes[type],
                            slotId,
                            slotName,
                            start: newStart,
                            end: newEnd,
                        });
                    } else {
                        console.log("Conflict occurred, set conflictOccurred func in Scheduler to handle it");
                    }
                } else {
                    if (isEvent) {
                        if (moveEvent !== undefined) {
                            moveEvent({
                                schedulerData,
                                event: item,
                                slotId,
                                slotName,
                                start: newStart,
                                end: newEnd,
                            });
                        }
                    } else {
                        if (newEvent !== undefined) {
                            newEvent({
                                schedulerData,
                                slotId,
                                slotName,
                                start: newStart,
                                end: newEnd,
                                type: DnDTypes[type],
                                item,
                            });
                        }
                    }
                }
            },

            canDrag: (props: { schedulerData: SchedulerData, resourceEvents: ResourceEvents }) => {
                const { schedulerData, resourceEvents } = props;
                const item = this.resolveDragObjFunc(props);
                if (schedulerData.isResizing()) { return false; }
                const { config } = schedulerData;
                return config.movable && (resourceEvents == undefined || !resourceEvents.groupOnly) && (item.movable == undefined || item.movable !== false);
            },
        };
    }

    public getDragCollect = (connect: any, monitor: DragSourceMonitor) => {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
            connectDragPreview: connect.dragPreview(),
        };
    }

    public getDragSource = () => {
        return this.dragSource;
    }
}
