import * as React from 'react';
import moment from 'moment';
import { Component, CSSProperties } from 'react';
// Col, Row and Icon do not have their own less files for styling. They use
// rules declared in antd's global css. If these styles are imported directly
// from within antd, they'll include, for instance, reset rules. These will
// affect everything on the page and in essence would leak antd's global styles
// into all projects using this library. Instead of doing that, we are using
// a hack which allows us to wrap all antd styles to target specific root. In
// this case the root id will be "RBS-Scheduler-root". This way the reset styles
// won't be applied to elements declared outside of <Scheduler /> component.
//
// You can get more context for the issue by reading:
// https://github.com/ant-design/ant-design/issues/4331
// The solution is based on:
// https://github.com/ant-design/ant-design/issues/4331#issuecomment-391066131
//
// For development
// This fix is implemented with webpack's NormalModuleReplacementPlugin in
// webpack/webpack-dev.config.js.
//
// For library builds
// This fix is implemented by the build script in scripts/build.js
//
// The next components have their own specific stylesheets which we import
// separately here to avoid importing from files which have required the global
// antd styles.
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import 'antd/lib/select/style/index.css';
import 'antd/lib/grid/style/index.css';
import Radio from 'antd/lib/radio';
import 'antd/lib/radio/style/index.css';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import Calendar from 'antd/lib/calendar';
import 'antd/lib/calendar/style/index.css';
import EventItem from './EventItem';
import DnDSource from './DnDSource';
import DnDContext from './DnDContext';
import ResourceView from './ResourceView';
import HeaderView from './HeaderView';
import BodyView from './BodyView';
import ResourceEvents from './ResourceEvents';
import AgendaView from './AgendaView';
import AddMorePopover from './AddMorePopover';
import { ViewTypes } from './types/ViewTypes';
import { CellUnits } from './types/CellUnits';
import { SummaryPos } from './types/SummaryPos';
import SchedulerData from './SchedulerData';
import { RenderData, Event, EventGroup, Header, Resource, EventRecurring } from './SchedulerData';
import { DATETIME_FORMAT, DATE_FORMAT } from './types/DateFormats';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface SchedulerProps {
  schedulerData: SchedulerData;
  prevClick: (action?: any) => any;
  nextClick: (action?: any) => any;
  onViewChange: (schedulerData: SchedulerData, view) => any;
  onSelectDate: (schedulerData: SchedulerData, date) => any;
  onSetAddMoreState?: (action?: any) => void;
  updateEventStart?: (schedulerData: SchedulerData, event: Event, newStart: string) => any;
  updateEventEnd?: (schedulerData: SchedulerData, event: Event, newEnd: string) => any;
  moveEvent?: (
    schedulerData: SchedulerData,
    event: Event,
    slotId: string,
    slotName: string,
    start: string,
    end: string
  ) => void;
  movingEvent?: (
    schedulerData: SchedulerData,
    slotId: string,
    slotName: string,
    newStart: string,
    newEnd: string,
    action: any,
    type: string,
    item: any
  ) => void;
  leftCustomHeader?: any;
  rightCustomHeader?: any;
  newEvent?: (
    schedulerData: SchedulerData,
    slotId: string,
    slotName: string,
    start: string,
    end: string,
    type: string,
    item: Event | EventGroup
  ) => void;
  subtitleGetter?: (schedulerData: SchedulerData, event: Event) => string;
  eventItemClick?: (schedulerData: SchedulerData, event: Event) => any;
  viewEventClick?: (schedulerData: SchedulerData, event: Event) => void;
  viewEventText?: string;
  viewEvent2Click?: (schedulerData: SchedulerData, event: Event) => void;
  viewEvent2Text?: string;
  conflictOccurred?: (schedulerData: SchedulerData, action, event, type, slotId, slotName, start, end) => void;
  eventItemTemplateResolver?: (
    schedulerData: SchedulerData,
    eventItem: Event,
    bgColor: string,
    isStart: boolean,
    isEnd: boolean,
    name: string,
    eventItemHeight: number,
    agendaMaxEventWidth: number
  ) => JSX.Element;
  eventItemPopoverTemplateResolver?: (
    schedulerData: SchedulerData,
    eventItem: Event,
    title: string,
    start: moment.Moment,
    end: moment.Moment,
    statusColor: string
  ) => JSX.Element;
  dndSources?: DnDSource[];
  slotClickedFunc?: (schedulerData: SchedulerData, item: RenderData) => void | JSX.Element;
  toggleExpandFunc?: (schedulerData: SchedulerData, slotId: string) => any;
  slotItemTemplateResolver?: (schedulerData: SchedulerData, slot, slotClickedFunc, width, clsName) => any;
  nonAgendaCellHeaderTemplateResolver?: (
    schedulerData: SchedulerData,
    item: any,
    formattedDateItems: any,
    style: CSSProperties
  ) => any;
  onScrollLeft?: (schedulerData: SchedulerData, schedulerContent, maxScrollLeft) => any;
  onScrollRight?: (schedulerData: SchedulerData, schedulerContent, maxScrollLeft) => any;
  onScrollTop?: (schedulerData: SchedulerData, schedulerContent, maxScrollTop) => any;
  onScrollBottom?: (schedulerData: SchedulerData, schedulerContent, maxScrollTop) => any;
}

export interface SchedulerContentState {
  visible: false;
  dndContext: DnDContext;
  contentHeight: number;
  contentScrollbarHeight: number;
  contentScrollbarWidth: number;
  resourceScrollbarHeight: number;
  resourceScrollbarWidth: number;
  scrollLeft: number;
  scrollTop: number;
  documentWidth: number;
  documentHeight: number;
}

export class Scheduler extends Component<SchedulerProps, SchedulerContentState> {
  public currentArea: number;
  public schedulerContent: any;
  public schedulerResource: any;
  public schedulerContentBgTable: any;
  public schedulerHead: any;

  constructor(props: Readonly<SchedulerProps>) {
    super(props);

    const { schedulerData, dndSources } = props;
    let sources = [];
    sources.push(
      new DnDSource((e) => {
        return e.eventItem;
      }, EventItem)
    );
    if (dndSources != undefined && dndSources.length > 0) {
      sources = [...sources, ...dndSources];
    }
    const dndContext = new DnDContext(sources, ResourceEvents);

    this.currentArea = -1;
    schedulerData.setDocumentWidth(document.documentElement.clientWidth);
    this.state = {
      visible: false,
      dndContext,
      contentHeight: schedulerData.getSchedulerContentDesiredHeight(),
      contentScrollbarHeight: 17,
      contentScrollbarWidth: 17,
      resourceScrollbarHeight: 17,
      resourceScrollbarWidth: 17,
      scrollLeft: 0,
      scrollTop: 0,
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    };

    if (schedulerData.isSchedulerResponsive()) {
      window.onresize = this.onWindowResize;
    }
  }

  public onWindowResize = (e: any) => {
    const { schedulerData } = this.props;
    schedulerData.setDocumentWidth(document.documentElement.clientWidth);
    this.setState({
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    });
  };

  public componentDidMount() {
    this.resolveScrollbarSize();
  }

  public componentDidUpdate() {
    this.resolveScrollbarSize();

    const { schedulerData } = this.props;
    const { behaviors } = schedulerData;
    if (schedulerData.getScrollToSpecialMoment() && !!behaviors.getScrollSpecialMomentFunc) {
      if (!!this.schedulerContent && this.schedulerContent.scrollWidth > this.schedulerContent.clientWidth) {
        const start = moment(schedulerData.startDate).startOf('day');
        const end = moment(schedulerData.endDate).endOf('day');
        const specialMoment = behaviors.getScrollSpecialMomentFunc(schedulerData, start, end);
        if (specialMoment >= start && specialMoment <= end) {
          let index = 0;
          schedulerData.headers.forEach((item) => {
            const header = moment(item.time);
            if (specialMoment >= header) {
              index++;
            }
          });
          this.schedulerContent.scrollLeft = (index - 1) * schedulerData.getContentCellWidth();

          schedulerData.setScrollToSpecialMoment(false);
        }
      }
    }
  }

  public render() {
    const { schedulerData, leftCustomHeader, rightCustomHeader } = this.props;
    const { renderData, viewType, showAgenda, isEventPerspective, config } = schedulerData;
    const width = schedulerData.getSchedulerWidth();
    const calendarPopoverEnabled = config.calendarPopoverEnabled;

    const dateLabel = schedulerData.getDateLabel();
    const defaultValue = `${viewType}${showAgenda ? 1 : 0}${isEventPerspective ? 1 : 0}`;
    const radioButtonList = config.views.map((item) => {
      return (
        <RadioButton
          key={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}
          value={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}
        >
          <span style={{ margin: '0px 8px' }}>{item.viewName}</span>
        </RadioButton>
      );
    });

    let tbodyContent = <tr />;
    if (showAgenda) {
      tbodyContent = <AgendaView {...this.props} />;
    } else {
      const resourceTableWidth = schedulerData.getResourceTableWidth();
      const schedulerContainerWidth = parseInt(width, undefined) - resourceTableWidth + 1;
      const schedulerWidth = schedulerData.getContentTableWidth() - 1;
      const DndResourceEvents = this.state.dndContext.getDropTarget();
      const eventDndSource = this.state.dndContext.getDndSource();

      const displayRenderData = renderData.filter((o) => o.render);
      const resourceEventsList = displayRenderData.map((item) => {
        // @ts-ignore
        // TODO - repair props
        return <DndResourceEvents {...this.props} key={item.slotId} resourceEvents={item} dndSource={eventDndSource} />;
      });

      const contentScrollbarHeight = this.state.contentScrollbarHeight;
      const contentScrollbarWidth = this.state.contentScrollbarWidth;
      const resourceScrollbarHeight = this.state.resourceScrollbarHeight;
      const resourceScrollbarWidth = this.state.resourceScrollbarWidth;
      const contentHeight = this.state.contentHeight;
      const resourcePaddingBottom = resourceScrollbarHeight === 0 ? contentScrollbarHeight : 0;
      const contentPaddingBottom = contentScrollbarHeight === 0 ? resourceScrollbarHeight : 0;
      let schedulerContentStyle = {
        overflow: 'auto',
        margin: '0px',
        position: 'relative',
        paddingBottom: contentPaddingBottom,
        maxHeight: undefined,
      };
      let resourceContentStyle = {
        overflowX: 'auto',
        overflowY: 'auto',
        width: resourceTableWidth + resourceScrollbarWidth - 2,
        margin: `0px -${contentScrollbarWidth}px 0px 0px`,
        maxHeight: undefined,
      };
      if (config.schedulerMaxHeight > 0) {
        schedulerContentStyle = {
          ...schedulerContentStyle,
          maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight,
        };
        resourceContentStyle = {
          ...resourceContentStyle,
          maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight,
        };
      }

      const resourceName = schedulerData.isEventPerspective ? config.taskName : config.resourceName;
      tbodyContent = (
        <tr>
          <td style={{ width: resourceTableWidth, verticalAlign: 'top' }}>
            <div className="resource-view">
              <div style={{ overflow: 'hidden', borderBottom: '1px solid #e9e9e9', height: config.tableHeaderHeight }}>
                <div
                  style={{ overflowX: 'scroll', overflowY: 'hidden', margin: `0px 0px -${contentScrollbarHeight}px` }}
                >
                  <table className="resource-table">
                    <thead>
                      <tr style={{ height: config.tableHeaderHeight }}>
                        <th className="header3-text">{resourceName}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div
                style={resourceContentStyle as CSSProperties}
                ref={this.schedulerResourceRef}
                onMouseOver={this.onSchedulerResourceMouseOver}
                onMouseOut={this.onSchedulerResourceMouseOut}
                onScroll={this.onSchedulerResourceScroll}
              >
                <ResourceView {...this.props} contentScrollbarHeight={resourcePaddingBottom} />
              </div>
            </div>
          </td>
          <td>
            <div className="scheduler-view" style={{ width: schedulerContainerWidth, verticalAlign: 'top' }}>
              <div style={{ overflow: 'hidden', borderBottom: '1px solid #e9e9e9', height: config.tableHeaderHeight }}>
                <div
                  style={{ overflowX: 'scroll', overflowY: 'hidden', margin: `0px 0px -${contentScrollbarHeight}px` }}
                  ref={this.schedulerHeadRef}
                  onMouseOver={this.onSchedulerHeadMouseOver}
                  onMouseOut={this.onSchedulerHeadMouseOut}
                  onScroll={this.onSchedulerHeadScroll}
                >
                  <div
                    style={{
                      paddingRight: `${contentScrollbarWidth}px`,
                      width: schedulerWidth + contentScrollbarWidth,
                    }}
                  >
                    <table className="scheduler-bg-table">
                      <HeaderView {...this.props} />
                    </table>
                  </div>
                </div>
              </div>
              <div
                style={schedulerContentStyle as CSSProperties}
                ref={this.schedulerContentRef}
                onMouseOver={this.onSchedulerContentMouseOver}
                onMouseOut={this.onSchedulerContentMouseOut}
                onScroll={this.onSchedulerContentScroll}
              >
                <div style={{ width: schedulerWidth, height: contentHeight }}>
                  <div className="scheduler-content">
                    <table className="scheduler-content-table">
                      <tbody>{resourceEventsList}</tbody>
                    </table>
                  </div>
                  <div className="scheduler-bg">
                    <table
                      className="scheduler-bg-table"
                      style={{ width: schedulerWidth }}
                      ref={this.schedulerContentBgTableRef}
                    >
                      <BodyView {...this.props} />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    const popover = (
      <div className="popover-calendar">
        <Calendar fullscreen={false} onSelect={this.onSelect} />
      </div>
    );
    let schedulerHeader = <div />;
    if (config.headerEnabled) {
      schedulerHeader = (
        <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: '24px' }}>
          {leftCustomHeader}
          <Col>
            <div className="header2-text">
              <Icon type="left" style={{ marginRight: '8px' }} className="icon-nav" onClick={this.goBack} />
              {calendarPopoverEnabled ? (
                <Popover
                  content={popover}
                  placement="bottom"
                  trigger="click"
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <span className={'header2-text-label'} style={{ cursor: 'pointer' }}>
                    {dateLabel}
                  </span>
                </Popover>
              ) : (
                <span className={'header2-text-label'}>{dateLabel}</span>
              )}
              <Icon type="right" style={{ marginLeft: '8px' }} className="icon-nav" onClick={this.goNext} />
            </div>
          </Col>
          <Col>
            <RadioGroup defaultValue={defaultValue} size="default" onChange={this.onViewChange}>
              {radioButtonList}
            </RadioGroup>
          </Col>
          {rightCustomHeader}
        </Row>
      );
    }

    return (
      <table id="RBS-Scheduler-root" className="scheduler" style={{ width: `${width}px` }}>
        <thead>
          <tr>
            <td colSpan={2}>{schedulerHeader}</td>
          </tr>
        </thead>
        <tbody>{tbodyContent}</tbody>
      </table>
    );
  }

  public resolveScrollbarSize = () => {
    const { schedulerData } = this.props;
    let contentScrollbarHeight = 17;
    let contentScrollbarWidth = 17;
    let resourceScrollbarHeight = 17;
    let resourceScrollbarWidth = 17;
    let contentHeight = schedulerData.getSchedulerContentDesiredHeight();
    if (!!this.schedulerContent) {
      contentScrollbarHeight = this.schedulerContent.offsetHeight - this.schedulerContent.clientHeight;
      contentScrollbarWidth = this.schedulerContent.offsetWidth - this.schedulerContent.clientWidth;
    }
    if (!!this.schedulerResource) {
      resourceScrollbarHeight = this.schedulerResource.offsetHeight - this.schedulerResource.clientHeight;
      resourceScrollbarWidth = this.schedulerResource.offsetWidth - this.schedulerResource.clientWidth;
    }
    if (!!this.schedulerContentBgTable && !!this.schedulerContentBgTable.offsetHeight) {
      contentHeight = this.schedulerContentBgTable.offsetHeight;
    }

    let tmpState = {};
    let needSet = false;
    if (contentScrollbarHeight != this.state.contentScrollbarHeight) {
      tmpState = { ...tmpState, contentScrollbarHeight };
      needSet = true;
    }
    if (contentScrollbarWidth != this.state.contentScrollbarWidth) {
      tmpState = { ...tmpState, contentScrollbarWidth };
      needSet = true;
    }
    if (contentHeight != this.state.contentHeight) {
      tmpState = { ...tmpState, contentHeight };
      needSet = true;
    }
    if (resourceScrollbarHeight != this.state.resourceScrollbarHeight) {
      tmpState = { ...tmpState, resourceScrollbarHeight };
      needSet = true;
    }
    if (resourceScrollbarWidth != this.state.resourceScrollbarWidth) {
      tmpState = { ...tmpState, resourceScrollbarWidth };
      needSet = true;
    }
    if (needSet) {
      this.setState(tmpState);
    }
  };

  public schedulerHeadRef = (element) => {
    this.schedulerHead = element;
  };

  public onSchedulerHeadMouseOver = () => {
    this.currentArea = 2;
  };

  public onSchedulerHeadMouseOut = () => {
    this.currentArea = -1;
  };

  public onSchedulerHeadScroll = (event) => {
    if (
      (this.currentArea === 2 || this.currentArea === -1) &&
      this.schedulerContent.scrollLeft != this.schedulerHead.scrollLeft
    ) {
      this.schedulerContent.scrollLeft = this.schedulerHead.scrollLeft;
    }
  };

  public schedulerResourceRef = (element) => {
    this.schedulerResource = element;
  };

  public onSchedulerResourceMouseOver = () => {
    this.currentArea = 1;
  };

  public onSchedulerResourceMouseOut = () => {
    this.currentArea = -1;
  };

  public onSchedulerResourceScroll = (event) => {
    if (
      (this.currentArea === 1 || this.currentArea === -1) &&
      this.schedulerContent.scrollTop != this.schedulerResource.scrollTop
    ) {
      this.schedulerContent.scrollTop = this.schedulerResource.scrollTop;
    }
  };

  public schedulerContentRef = (element) => {
    this.schedulerContent = element;
  };

  public schedulerContentBgTableRef = (element) => {
    this.schedulerContentBgTable = element;
  };

  public onSchedulerContentMouseOver = () => {
    this.currentArea = 0;
  };

  public onSchedulerContentMouseOut = () => {
    this.currentArea = -1;
  };

  public onSchedulerContentScroll = (event) => {
    if (this.currentArea === 0 || this.currentArea === -1) {
      if (this.schedulerHead.scrollLeft != this.schedulerContent.scrollLeft) {
        this.schedulerHead.scrollLeft = this.schedulerContent.scrollLeft;
      }
      if (this.schedulerResource.scrollTop != this.schedulerContent.scrollTop) {
        this.schedulerResource.scrollTop = this.schedulerContent.scrollTop;
      }
    }

    const { schedulerData, onScrollLeft, onScrollRight, onScrollTop, onScrollBottom } = this.props;
    const { scrollLeft, scrollTop } = this.state;
    if (this.schedulerContent.scrollLeft !== scrollLeft) {
      if (this.schedulerContent.scrollLeft === 0 && onScrollLeft != undefined) {
        onScrollLeft(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollWidth - this.schedulerContent.clientWidth
        );
      }
      if (
        this.schedulerContent.scrollLeft === this.schedulerContent.scrollWidth - this.schedulerContent.clientWidth &&
        onScrollRight != undefined
      ) {
        onScrollRight(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollWidth - this.schedulerContent.clientWidth
        );
      }
    } else if (this.schedulerContent.scrollTop !== scrollTop) {
      if (this.schedulerContent.scrollTop === 0 && onScrollTop != undefined) {
        onScrollTop(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollHeight - this.schedulerContent.clientHeight
        );
      }
      if (
        this.schedulerContent.scrollTop === this.schedulerContent.scrollHeight - this.schedulerContent.clientHeight &&
        onScrollBottom != undefined
      ) {
        onScrollBottom(
          schedulerData,
          this.schedulerContent,
          this.schedulerContent.scrollHeight - this.schedulerContent.clientHeight
        );
      }
    }
    this.setState({
      scrollLeft: this.schedulerContent.scrollLeft,
      scrollTop: this.schedulerContent.scrollTop,
    });
  };

  public onViewChange = (e) => {
    const { onViewChange, schedulerData } = this.props;
    const viewType = parseInt(e.target.value.charAt(0), undefined);
    const showAgenda = e.target.value.charAt(1) === '1';
    const isEventPerspective = e.target.value.charAt(2) === '1';
    onViewChange(schedulerData, { viewType, showAgenda, isEventPerspective });
  };

  public goNext = () => {
    const { nextClick, schedulerData } = this.props;
    nextClick(schedulerData);
  };

  public goBack = () => {
    const { prevClick, schedulerData } = this.props;
    prevClick(schedulerData);
  };

  public handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  public onSelect = (date) => {
    this.setState({
      visible: false,
    });

    const { onSelectDate, schedulerData } = this.props;
    onSelectDate(schedulerData, date);
  };
}

export { SchedulerData };
export {
  RenderData as SchedulerRenderData,
  Event as SchedulerEvent,
  EventGroup as SchedulerEventGroup,
  Header as SchedulerHeader,
  Resource as SchedulerResource,
  EventRecurring as SchedulerEventRecurring,
  DATETIME_FORMAT as SCHEDULER_DATETIME_FORMAT,
  DATE_FORMAT as SCHEDULER_DATE_FORMAT,
  ViewTypes as SchedulerViewTypes,
  AddMorePopover as SchedulerAddMorePopover,
  DnDSource as SchedulerDnDSource,
  CellUnits as SchedulerCellUnits,
  SummaryPos as SchedulerSummaryPos,
};
