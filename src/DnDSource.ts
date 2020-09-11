import { DragSource } from 'react-dnd';
import moment from 'moment';
import { DnDTypes } from './types/DnDTypes';
import { ViewTypes } from './types/ViewTypes';
import { DATETIME_FORMAT } from './types/DateFormats';
import { SchedulerData } from './Scheduler';
import ResourceEvents from './ResourceEvents';
import { Event } from './SchedulerData';

export default class DnDSource {
  public resolveDragObjFunc: (props: any) => any;
  public DecoratedComponent: any;
  public dndType: string;
  public dragSource: any;
  constructor(resolveDragObjFunc: any, DecoratedComponent: any, dndType: string = DnDTypes.EVENT) {
    this.resolveDragObjFunc = resolveDragObjFunc;
    this.DecoratedComponent = DecoratedComponent;
    this.dndType = dndType;
    this.dragSource = DragSource(this.dndType, this.getDragSpec(), this.getDragCollect)(this.DecoratedComponent);
  }

  public getDragSpec = () => {
    return {
      beginDrag: (props: any, monitor: any, component: any) => {
        return this.resolveDragObjFunc(props);
      },
      endDrag: (
        props: {
          schedulerData: SchedulerData;
          moveEvent: (
            schedulerData: SchedulerData,
            event: Event,
            slotId: string,
            slotName: string,
            start: string,
            end: string
          ) => void;
          newEvent: (
            schedulerData: SchedulerData,
            slotId: string,
            slotName: string,
            start: string,
            end: string,
            type: string,
            item: any
          ) => void;
          conflictOccurred?: (
            schedulerData: SchedulerData,
            action: any,
            event: Event,
            type: string,
            slotId: string,
            slotName: string,
            start: string,
            end: string
          ) => void;
        },
        monitor: any,
        component: any
      ) => {
        if (!monitor.didDrop()) {
          return;
        }

        const { moveEvent, newEvent, schedulerData } = props;
        const { events, config, viewType } = schedulerData;
        const item = monitor.getItem();
        const type = monitor.getItemType();
        const dropResult = monitor.getDropResult();
        let slotId = dropResult.slotId;
        let slotName = dropResult.slotName;
        let newStart = dropResult.start;
        let newEnd = dropResult.end;
        const initialStart = dropResult.initialStart;
        const initialEnd = dropResult.initialEnd;
        let action = 'New';

        const isEvent = type === DnDTypes.EVENT;
        if (isEvent) {
          const event = item;
          if (config.relativeMove) {
            newStart = moment(event.start)
              .add(moment(newStart).diff(moment(initialStart)), 'ms')
              .format(DATETIME_FORMAT);
          } else {
            if (viewType !== ViewTypes.Day) {
              const tmpMoment = moment(newStart);
              newStart = moment(event.start)
                .year(tmpMoment.year())
                .month(tmpMoment.month())
                .date(tmpMoment.date())
                .format(DATETIME_FORMAT);
            }
          }
          newEnd = moment(newStart)
            .add(moment(event.end).diff(moment(event.start)), 'ms')
            .format(DATETIME_FORMAT);

          // if crossResourceMove disabled, slot returns old value
          if (config.crossResourceMove === false) {
            slotId = schedulerData.getEventSlotId(item);
            slotName = undefined;
            const slot = schedulerData.getSlotById(slotId);
            if (!!slot) {
              slotName = slot.name;
            }
          }

          action = 'Move';
        }

        let hasConflict = false;
        let conflictingEvents = [];
        if (config.checkConflict) {
          const start = moment(newStart);
          const end = moment(newEnd);

          events.forEach((e: any) => {
            if (schedulerData.getEventSlotId(e) === slotId && (!isEvent || e.id !== item.id)) {
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
        const slot = schedulerData.getSlotById(slotId)
        const passMax = conflictingEvents.length >= slot.maxItemsPerDay - 1
        if (hasConflict && passMax) {
          const { conflictOccurred } = props;
          if (conflictOccurred != undefined) {
            //Moving Item Conflict Check
            conflictOccurred(schedulerData, action, item, type, slotId, slotName, newStart, newEnd);
          } else {
            console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
          }
        } else {
          if (isEvent) {
            if (moveEvent !== undefined) {
              moveEvent(schedulerData, item, slotId, slotName, newStart, newEnd);
            }
          } else {
            if (newEvent !== undefined) {
              newEvent(schedulerData, slotId, slotName, newStart, newEnd, type, item);
            }
          }
        }
      },

      canDrag: (props: { schedulerData: SchedulerData; resourceEvents: ResourceEvents }) => {
        const { schedulerData, resourceEvents } = props;
        const item = this.resolveDragObjFunc(props);
        if (schedulerData.isResizing()) {
          return false;
        }
        const { config } = schedulerData;
        return (
          config.movable &&
          (resourceEvents == undefined || !resourceEvents.groupOnly) &&
          (item.movable == undefined || item.movable !== false)
        );
      },
    };
  };

  public getDragCollect = (connect: any, monitor: any) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
      connectDragPreview: connect.dragPreview(),
    };
  };

  public getDragSource = () => {
    return this.dragSource;
  };
}
