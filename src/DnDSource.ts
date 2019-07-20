import { DragSource } from 'react-dnd'
import * as moment from 'moment';
import { DnDTypes } from './types/DnDTypes'
import { ViewTypes } from './types/ViewTypes'
import { DATETIME_FORMAT } from './types/DateFormats'
import { SchedulerData } from './Scheduler';
import ResourceEvents from './ResourceEvents';
import { Event } from './SchedulerData'

export default class DnDSource {
    resolveDragObjFunc: (props: any) => any;
    DecoratedComponent: any;
    dndType: string;
    dragSource: any;
    constructor(resolveDragObjFunc: any, DecoratedComponent: any, dndType: string = DnDTypes.EVENT) {
        this.resolveDragObjFunc = resolveDragObjFunc;
        this.DecoratedComponent = DecoratedComponent;
        this.dndType = dndType;
        this.dragSource = DragSource(this.dndType, this.getDragSpec(), this.getDragCollect)(this.DecoratedComponent);
    }

    getDragSpec = () => {
        return {
            beginDrag: (props: any, monitor: any, component: any) => {
                return this.resolveDragObjFunc(props);
            },
            endDrag: (props: {
                schedulerData: SchedulerData,
                moveEvent: (schedulerData: SchedulerData, event: Event, slotId: String, slotName: String, start: string, end: String) => void,
                newEvent: (schedulerData: SchedulerData, slotId: string, slotName: string, start: string, end: string, type: string, item: any) => void,
                conflictOccurred?: (schedulerData: SchedulerData, action: any, event: Event, type: string, slotId: string, slotName: string, start: string, end: String) => void,
            }, monitor: any, component: any) => {
                if (!monitor.didDrop()) return;

                const { moveEvent, newEvent, schedulerData } = props;
                const { events, config, viewType } = schedulerData;
                const item = monitor.getItem();
                const type = monitor.getItemType();
                const dropResult = monitor.getDropResult();
                let slotId = dropResult.slotId, slotName = dropResult.slotName;
                let newStart = dropResult.start, newEnd = dropResult.end;
                let initialStart = dropResult.initialStart, initialEnd = dropResult.initialEnd;
                let action = 'New';

                let isEvent = type === DnDTypes.EVENT;
                if (isEvent) {
                    const event = item;
                    if (config.relativeMove) {
                        newStart = moment(event.start).add(moment(newStart).diff(moment(initialStart)), 'ms').format(DATETIME_FORMAT);
                    } else {
                        if (viewType !== ViewTypes.Day) {
                            let tmpMoment = moment(newStart);
                            newStart = moment(event.start).year(tmpMoment.year()).month(tmpMoment.month()).date(tmpMoment.date()).format(DATETIME_FORMAT);
                        }
                    }
                    newEnd = moment(newStart).add(moment(event.end).diff(moment(event.start)), 'ms').format(DATETIME_FORMAT);

                    //if crossResourceMove disabled, slot returns old value
                    if (config.crossResourceMove === false) {
                        slotId = schedulerData.getEventSlotId(item);
                        slotName = undefined;
                        let slot = schedulerData.getSlotById(slotId);
                        if (!!slot)
                            slotName = slot.name;
                    }

                    action = 'Move';
                }

                let hasConflict = false;
                if (config.checkConflict) {
                    let start = moment(newStart),
                        end = moment(newEnd);

                    events.forEach((e: any) => {
                        if (schedulerData.getEventSlotId(e) === slotId && (!isEvent || e.id !== item.id)) {
                            let eStart = moment(e.start),
                                eEnd = moment(e.end);
                            if ((start >= eStart && start < eEnd) || (end > eStart && end <= eEnd) || (eStart >= start && eStart < end) || (eEnd > start && eEnd <= end))
                                hasConflict = true;
                        }
                    });
                }

                if (hasConflict) {
                    const { conflictOccurred } = props;
                    if (conflictOccurred != undefined) {
                        conflictOccurred(schedulerData, action, item, type, slotId, slotName, newStart, newEnd);
                    }
                    else {
                        console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
                    }
                }
                else {
                    if (isEvent) {
                        if (moveEvent !== undefined) {
                            moveEvent(schedulerData, item, slotId, slotName, newStart, newEnd);
                        }
                    }
                    else {
                        if (newEvent !== undefined)
                            newEvent(schedulerData, slotId, slotName, newStart, newEnd, type, item);
                    }
                }
            },

            canDrag: (props: { schedulerData: SchedulerData, resourceEvents: ResourceEvents }) => {
                const { schedulerData, resourceEvents } = props;
                const item = this.resolveDragObjFunc(props);
                if (schedulerData.isResizing()) return false;
                const { config } = schedulerData;
                return config.movable && (resourceEvents == undefined || !resourceEvents.groupOnly) && (item.movable == undefined || item.movable !== false);
            }
        }
    }

    getDragCollect = (connect: any, monitor: any) => {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
            connectDragPreview: connect.dragPreview()
        };
    }

    getDragSource = () => {
        return this.dragSource;
    }
}
