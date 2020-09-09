import moment from 'moment';
import { ViewTypes } from './types/ViewTypes';
import { CellUnits } from './types/CellUnits';
import { DATE_FORMAT } from './types/DateFormats';
import { SchedulerData } from './Scheduler';
import { Event } from './SchedulerData';

// getSummary func example
export const getSummary = (
  schedulerData: SchedulerData,
  headerEvents: Event[],
  slotId: string,
  slotName: string,
  headerStart: any,
  headerEnd: any
) => {
  return { text: 'Summary', color: 'red', fontSize: '1.2rem' };
};

// getCustomDate example
export const getCustomDate = (schedulerData: SchedulerData, num: number, date: string = undefined) => {
  const { viewType } = schedulerData;
  let selectDate = schedulerData.startDate;
  if (date != undefined) {
    selectDate = date;
  }

  let startDate =
    num === 0
      ? selectDate
      : moment(selectDate)
          .add(2 * num, 'days')
          .format(DATE_FORMAT);
  let endDate = moment(startDate).add(1, 'days').format(DATE_FORMAT);
  let cellUnit = CellUnits.Hour;
  if (viewType === ViewTypes.Custom1) {
    const monday = moment(selectDate).startOf('week').format(DATE_FORMAT);
    startDate =
      num === 0
        ? monday
        : moment(monday)
            .add(2 * num, 'weeks')
            .format(DATE_FORMAT);
    endDate = moment(startDate).add(1, 'weeks').endOf('week').format(DATE_FORMAT);
    cellUnit = CellUnits.Day;
  } else if (viewType === ViewTypes.Custom2) {
    const firstDayOfMonth = moment(selectDate).startOf('month').format(DATE_FORMAT);
    startDate =
      num === 0
        ? firstDayOfMonth
        : moment(firstDayOfMonth)
            .add(2 * num, 'months')
            .format(DATE_FORMAT);
    endDate = moment(startDate).add(1, 'months').endOf('month').format(DATE_FORMAT);
    cellUnit = CellUnits.Day;
  }

  return {
    startDate,
    endDate,
    cellUnit,
  };
};

// getNonAgendaViewBodyCellBgColor example
export const getNonAgendaViewBodyCellBgColor = (schedulerData: SchedulerData, slotId, header) => {
  if (!header.nonWorkingTime) {
    return '#87e8de';
  }

  return undefined;
};

// getDateLabel func example
export const getDateLabel = (schedulerData: SchedulerData, viewType: number, startDate: string, endDate: string) => {
  const start = moment(startDate);
  const end = moment(endDate);
  let dateLabel = start.format('MMM D, YYYY');

  if (
    viewType === ViewTypes.Week ||
    (start != end &&
      (viewType === ViewTypes.Custom || viewType === ViewTypes.Custom1 || viewType === ViewTypes.Custom2))
  ) {
    dateLabel = `${start.format('MMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) {
      dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
    }
    if (start.year() !== end.year()) {
      dateLabel = `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`;
    }
  } else if (viewType === ViewTypes.Month) {
    dateLabel = start.format('MMMM YYYY');
  } else if (viewType === ViewTypes.Quarter) {
    dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
  } else if (viewType === ViewTypes.Year) {
    dateLabel = start.format('YYYY');
  }

  return dateLabel;
};

export const getEventText = (schedulerData: SchedulerData, event: Event) => {
  if (!schedulerData.isEventPerspective) {
    return event.title;
  }

  let eventText = event.title;
  schedulerData.resources.forEach((item) => {
    if (item.id === event.resourceId) {
      eventText = item.name;
    }
  });

  return eventText;
};

export const getScrollSpecialMoment = (
  schedulerData: SchedulerData,
  startMoment: moment.Moment,
  endMoment: moment.Moment
) => {
  return endMoment;
};

export const isNonWorkingTime = (schedulerData: SchedulerData, time: string) => {
  // const { localeMoment } = schedulerData;
  if (schedulerData.cellUnit === CellUnits.Hour) {
    const hour = moment(time).hour();
    if (hour < 9 || hour > 18) {
      return true;
    }
  } else {
    const dayOfWeek = moment(time).weekday();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
  }

  return false;
};

export default {
  // getSummaryFunc: getSummary,
  getSummaryFunc: undefined,
  // getCustomDateFunc: getCustomDate,
  getCustomDateFunc: undefined,
  // getNonAgendaViewBodyCellBgColorFunc: getNonAgendaViewBodyCellBgColor,
  getNonAgendaViewBodyCellBgColorFunc: undefined,
  getScrollSpecialMomentFunc: getScrollSpecialMoment,
  getDateLabelFunc: getDateLabel,
  getEventTextFunc: getEventText,
  isNonWorkingTimeFunc: isNonWorkingTime,
};
