import * as React from 'react';
import { Component, CSSProperties } from 'react';
import { CellUnits } from './types/CellUnits';
import moment from 'moment';
import { SchedulerData } from './Scheduler';
import { Header } from './SchedulerData';

interface HeaderViewProps {
  schedulerData: SchedulerData;
  nonAgendaCellHeaderTemplateResolver?: (
    schedulerData: SchedulerData,
    item: Header,
    formattedDateItems: any,
    style: CSSProperties
  ) => JSX.Element;
}

class HeaderView extends Component<HeaderViewProps> {
  constructor(props: Readonly<HeaderViewProps>) {
    super(props);
  }

  public render() {
    const { schedulerData } = this.props;
    const { headers, cellUnit, config } = schedulerData;
    const headerHeight = schedulerData.getTableHeaderHeight();
    const cellWidth = schedulerData.getContentCellWidth();
    const minuteStepsInHour = schedulerData.getMinuteStepsInHour();

    let headerList = [];
    let style = {};
    if (cellUnit === CellUnits.Hour) {
      headers.forEach((item, index) => {
        if (index % minuteStepsInHour === 0) {
          const datetime = moment(item.time);

          style = !!item.nonWorkingTime
            ? {
                width: cellWidth * minuteStepsInHour,
                color: config.nonWorkingTimeHeadColor,
                backgroundColor: config.nonWorkingTimeHeadBgColor,
              }
            : { width: cellWidth * minuteStepsInHour };

          if (index === headers.length - minuteStepsInHour) {
            style = !!item.nonWorkingTime
              ? { color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor }
              : {};
          }

          const pFormattedList = config.nonAgendaDayCellHeaderFormat.split('|').map((i) => datetime.format(i));
          let element;

          if (typeof this.props.nonAgendaCellHeaderTemplateResolver === 'function') {
            element = this.props.nonAgendaCellHeaderTemplateResolver(schedulerData, item, pFormattedList, style);
          } else {
            const pList = pFormattedList.map((i, ind) => <div key={ind}>{i}</div>);

            element = (
              <th key={item.time} className="header3-text" style={style}>
                <div>{pList}</div>
              </th>
            );
          }

          headerList.push(element);
        }
      });
    } else {
      headerList = headers.map((item, index) => {
        const datetime = moment(item.time);
        style = !!item.nonWorkingTime
          ? {
              width: cellWidth,
              color: config.nonWorkingTimeHeadColor,
              backgroundColor: config.nonWorkingTimeHeadBgColor,
            }
          : { width: cellWidth };
        if (index === headers.length - 1) {
          style = !!item.nonWorkingTime
            ? { color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor }
            : {};
        }

        const pFormattedList = config.nonAgendaOtherCellHeaderFormat.split('|').map((i) => datetime.format(i));

        if (typeof this.props.nonAgendaCellHeaderTemplateResolver === 'function') {
          return this.props.nonAgendaCellHeaderTemplateResolver(schedulerData, item, pFormattedList, style);
        }

        const pList = pFormattedList.map((i, ind) => <div key={ind}>{i}</div>);

        return (
          <th key={item.time} className="header3-text" style={style}>
            <div>{pList}</div>
          </th>
        );
      });
    }

    return (
      <thead>
        <tr style={{ height: headerHeight }}>{headerList}</tr>
      </thead>
    );
  }
}

export default HeaderView;
