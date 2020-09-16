import { DropTarget } from 'react-dnd';
import { getPos } from './Util';
import { DnDTypes } from './types/DnDTypes';
import { CellUnits } from './types/CellUnits';
import { DATETIME_FORMAT } from './types/DateFormats';
import { ViewTypes } from './types/ViewTypes';
import moment from 'moment';
import { SchedulerData } from './Scheduler';
import ResourceEvents from './ResourceEvents';
import { Identifier } from 'dnd-core';
import { Event } from './SchedulerData';
import DnDSource from './DnDSource';
export default class DnDContext {
  public sourceMap: Map<any, any>;
  public DecoratedComponent: any;
  constructor(sources: DnDSource[], DecoratedComponent: any) {
    this.sourceMap = new Map();
    sources.forEach((item: DnDSource) => {
      this.sourceMap.set(item.dndType, item);
    });
    this.DecoratedComponent = DecoratedComponent;
  }

  public getDropSpec = () => {
    return {
      drop: (
        props: {
          schedulerData: SchedulerData;
          resourceEvents: ResourceEvents;
        },
        monitor: any,
        component: any
      ) => {
        const { schedulerData, resourceEvents } = props;
        const { cellUnit } = schedulerData;
        const type = monitor.getItemType();
        const pos = getPos(component.eventContainer);
        const cellWidth = schedulerData.getContentCellWidth();
        // tslint:disable-next-line: one-variable-per-declaration
        let initialStartTime = null;
        let initialEndTime = null;
        if (type === DnDTypes.EVENT) {
          const initialPoint = monitor.getInitialClientOffset();
          const initialLeftIndex = Math.floor((initialPoint.x - pos.x) / cellWidth);
          initialStartTime = resourceEvents.headerItems[initialLeftIndex].start;
          initialEndTime = resourceEvents.headerItems[initialLeftIndex].end;
          if (cellUnit !== CellUnits.Hour) {
            initialEndTime = moment(resourceEvents.headerItems[initialLeftIndex].start)
              .hour(23)
              .minute(59)
              .second(59)
              .format(DATETIME_FORMAT);
          }
        }
        const point = monitor.getClientOffset();
        const leftIndex = Math.floor((point.x - pos.x) / cellWidth);
        const startTime = resourceEvents.headerItems[leftIndex].start;
        let endTime = resourceEvents.headerItems[leftIndex].end;
        if (cellUnit !== CellUnits.Hour) {
          endTime = moment(resourceEvents.headerItems[leftIndex].start)
            .hour(23)
            .minute(59)
            .second(59)
            .format(DATETIME_FORMAT);
        }

        return {
          slotId: resourceEvents.slotId,
          slotName: resourceEvents.slotName,
          start: startTime,
          end: endTime,
          initialStart: initialStartTime,
          initialEnd: initialEndTime,
        };
      },

      hover: (
        props: {
          schedulerData: SchedulerData;
          resourceEvents: ResourceEvents;
          movingEvent: (
            schedulerData: SchedulerData,
            slotId: string,
            slotName: string,
            newStart: string,
            newEnd: string,
            action: string,
            type: Identifier,
            item: Event
          ) => void;
        },
        monitor: any,
        component: any
      ) => {
        const { schedulerData, resourceEvents, movingEvent } = props;
        const { cellUnit, config, viewType } = schedulerData;
        const item = monitor.getItem();
        const type = monitor.getItemType();
        const pos = getPos(component.eventContainer);
        const cellWidth = schedulerData.getContentCellWidth();
        let initialStart = null;
        let initialEnd = null;
        if (type === DnDTypes.EVENT) {
          const initialPoint = monitor.getInitialClientOffset();
          const initialLeftIndex = Math.floor((initialPoint.x - pos.x) / cellWidth);
          initialStart = resourceEvents.headerItems[initialLeftIndex].start;
          initialEnd = resourceEvents.headerItems[initialLeftIndex].end;
          if (cellUnit !== CellUnits.Hour) {
            initialEnd = moment(resourceEvents.headerItems[initialLeftIndex].start)
              .hour(23)
              .minute(59)
              .second(59)
              .format(DATETIME_FORMAT);
          }
        }
        const point = monitor.getClientOffset();
        const leftIndex = Math.floor((point.x - pos.x) / cellWidth);
        const newStartH = resourceEvents.headerItems[leftIndex];
        let newStart = newStartH ? newStartH.start : schedulerData.startDate;
        const newEndH = resourceEvents.headerItems[leftIndex];
        let newEnd = newEndH ? newEndH.end : schedulerData.endDate;

        if (cellUnit !== CellUnits.Hour) {
          newEnd = moment(newStart).hour(23).minute(59).second(59).format(DATETIME_FORMAT);
        }

        let slotId = resourceEvents.slotId;
        let slotName = resourceEvents.slotName;
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

        if (!!movingEvent) {
          movingEvent(schedulerData, slotId, slotName, newStart, newEnd, action, type, item);
        }
      },

      canDrop: (
        props: {
          schedulerData: SchedulerData;
          resourceEvents: ResourceEvents;
        },
        monitor: any
      ) => {
        const { schedulerData, resourceEvents } = props;
        const item = monitor.getItem();
        if (schedulerData.isResizing()) {
          return false;
        }
        const { config } = schedulerData;
        return config.movable && !resourceEvents.groupOnly && (item.movable === undefined || item.movable !== false);
      },
    };
  };

  public getDropCollect = (connect: any, monitor: any) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
    };
  };

  public getDropTarget = () => {
    return DropTarget(
      Array.from(this.sourceMap.keys()),
      this.getDropSpec(),
      this.getDropCollect
    )(this.DecoratedComponent);
  };

  public getDndSource = (dndType = DnDTypes.EVENT) => {
    return this.sourceMap.get(dndType);
  };
}
