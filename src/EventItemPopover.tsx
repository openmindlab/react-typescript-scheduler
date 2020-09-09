import * as React from 'react';
import { Component, CSSProperties } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import moment from 'moment';
import { SchedulerData } from './Scheduler';
import { Event } from './SchedulerData';

interface EventItemPopoverProps {
  schedulerData: SchedulerData;
  eventItem: Event;
  title: string;
  startTime: string;
  endTime: string;
  statusColor: string;
  subtitleGetter?: (schedulerData: SchedulerData, eventItem: Event) => string;
  viewEventClick?: (schedulerData: SchedulerData, eventItem: Event) => void;
  viewEventText?: string;
  viewEvent2Click?: (schedulerData: SchedulerData, eventItem: Event) => void;
  viewEvent2Text?: string;
  eventItemPopoverTemplateResolver?: (
    schedulerData: SchedulerData,
    eventItem: Event,
    title: string,
    start: moment.Moment,
    end: moment.Moment,
    statusColor: string
  ) => JSX.Element;
}

class EventItemPopover extends Component<EventItemPopoverProps> {
  constructor(props: Readonly<EventItemPopoverProps>) {
    super(props);
  }

  public render() {
    const {
      schedulerData,
      eventItem,
      title,
      startTime,
      endTime,
      statusColor,
      subtitleGetter,
      viewEventClick,
      viewEventText,
      viewEvent2Click,
      viewEvent2Text,
      eventItemPopoverTemplateResolver,
    } = this.props;
    const { config } = schedulerData;
    const start = moment(startTime);
    const end = moment(endTime);

    if (eventItemPopoverTemplateResolver != undefined) {
      return eventItemPopoverTemplateResolver(schedulerData, eventItem, title, start, end, statusColor);
    } else {
      let subtitleRow = <div />;
      if (subtitleGetter !== undefined) {
        const subtitle = subtitleGetter(schedulerData, eventItem);
        if (subtitle != undefined) {
          subtitleRow = (
            <Row type="flex" align="middle">
              <Col span={2}>
                <div />
              </Col>
              <Col span={22} className="overflow-text">
                <span className="header2-text" title={subtitle}>
                  {subtitle}
                </span>
              </Col>
            </Row>
          );
        }
      }

      let opsRow = <div />;
      if (
        viewEventText !== undefined &&
        viewEventClick !== undefined &&
        (eventItem.clickable1 == undefined || eventItem.clickable1)
      ) {
        let col = (
          <Col span={22}>
            <span
              className="header2-text"
              style={{ color: '#108EE9', cursor: 'pointer' }}
              onClick={() => {
                viewEventClick(schedulerData, eventItem);
              }}
            >
              {viewEventText}
            </span>
          </Col>
        );
        if (
          viewEvent2Text !== undefined &&
          viewEvent2Click !== undefined &&
          (eventItem.clickable2 == undefined || eventItem.clickable2)
        ) {
          col = (
            <Col span={22}>
              <span
                className="header2-text"
                style={{ color: '#108EE9', cursor: 'pointer' }}
                onClick={() => {
                  viewEventClick(schedulerData, eventItem);
                }}
              >
                {viewEventText}
              </span>
              <span
                className="header2-text"
                style={{ color: '#108EE9', cursor: 'pointer', marginLeft: '16px' }}
                onClick={() => {
                  viewEvent2Click(schedulerData, eventItem);
                }}
              >
                {viewEvent2Text}
              </span>
            </Col>
          );
        }
        opsRow = (
          <Row type="flex" align="middle">
            <Col span={2}>
              <div />
            </Col>
            {col}
          </Row>
        );
      } else if (
        viewEvent2Text !== undefined &&
        viewEvent2Click !== undefined &&
        (eventItem.clickable2 == undefined || eventItem.clickable2)
      ) {
        const col = (
          <Col span={22}>
            <span
              className="header2-text"
              style={{ color: '#108EE9', cursor: 'pointer' }}
              onClick={() => {
                viewEvent2Click(schedulerData, eventItem);
              }}
            >
              {viewEvent2Text}
            </span>
          </Col>
        );
        opsRow = (
          <Row type="flex" align="middle">
            <Col span={2}>
              <div />
            </Col>
            {col}
          </Row>
        );
      }

      const dateFormat = config.eventItemPopoverDateFormat;
      return (
        <div style={{ width: '300px' }}>
          <Row type="flex" align="middle">
            <Col span={2}>
              <div className="status-dot" style={{ backgroundColor: statusColor }} />
            </Col>
            <Col span={22} className="overflow-text">
              <span className="header2-text" title={title}>
                {title}
              </span>
            </Col>
          </Row>
          {subtitleRow}
          <Row type="flex" align="middle">
            <Col span={2}>
              <div />
            </Col>
            <Col span={22}>
              <span className="header1-text">{start.format('HH:mm')}</span>
              <span className="help-text" style={{ marginLeft: '8px' }}>
                {start.format(dateFormat)}
              </span>
              <span className="header2-text" style={{ marginLeft: '8px' }}>
                -
              </span>
              <span className="header1-text" style={{ marginLeft: '8px' }}>
                {end.format('HH:mm')}
              </span>
              <span className="help-text" style={{ marginLeft: '8px' }}>
                {end.format(dateFormat)}
              </span>
            </Col>
          </Row>
          {opsRow}
        </div>
      );
    }
  }
}

export default EventItemPopover;
