import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerHeader,
} from "../src/Scheduler";
import * as ExampleFunction from "./utils/ExampleFunctions";
import * as moment from "moment";
import { DemoData } from "./utils/DemoData";
import Nav from "./utils/Nav";
import withDragDropContext from "./utils/withDnDContext";
import Header from "antd/lib/calendar/Header";

class Locale extends Component<{}, { viewModel: SchedulerData, headerItem: SchedulerHeader, left: number, top: number, height: number }> {
    constructor(props: Readonly<{}>) {
        super(props);

        moment.locale("zh-cn");
        const schedulerData = new SchedulerData(
            ExampleFunction.updateSchedulerDataState.bind(this),
            ExampleFunction.getNow(),
            SchedulerViewTypes.Week,
            false,
            false,
            {
                dayMaxEvents: 2,
                weekMaxEvents: 4,
                monthMaxEvents: 4,
                yearMaxEvents: 4,
                resourceName: "资源名称",
                taskName: "任务名称",
                agendaViewHeader: "工作事项",
                addMorePopoverHeaderFormat: "YYYY年M月D日 dddd",
                eventItemPopoverDateFormat: "M月D日",
                nonAgendaDayCellHeaderFormat: "HH:mm",
                nonAgendaOtherCellHeaderFormat: "ddd|M/D",
                views: [
                    { viewName: "天", viewType: SchedulerViewTypes.Day, showAgenda: false, isEventPerspective: false },
                    { viewName: "周", viewType: SchedulerViewTypes.Week, showAgenda: false, isEventPerspective: false },
                    { viewName: "月", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: false },
                    { viewName: "季", viewType: SchedulerViewTypes.Quarter, showAgenda: false, isEventPerspective: false },
                    { viewName: "年", viewType: SchedulerViewTypes.Year, showAgenda: false, isEventPerspective: false },
                ],
            }, {
                getDateLabelFunc: this.getDateLabel,
                isNonWorkingTimeFunc: this.isNonWorkingTime,
            });
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
            headerItem: undefined,
            left: 0,
            top: 0,
            height: 0,
        };
    }

    public render() {
        const { viewModel } = this.state;
        const popover = <div />;
        if (this.state.headerItem !== undefined) {
            {/*popover =
                <AddMorePopover headerItem={this.state.headerItem} eventItemClick={this.eventClicked}
                    viewEventClick={this.ops1} viewEventText="Ops 1"
                    viewEvent2Click={this.ops2} viewEvent2Text="Ops 2"
                    schedulerData={viewModel}
                    closeAction={this.onSetAddMoreState} left={this.state.left} top={this.state.top}
                    height={this.state.height} moveEvent={this.moveEvent} />;
            */}
        }
        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: "center" }}>Locale</h3>
                    <Scheduler schedulerData={viewModel}
                        prevClick={ExampleFunction.prevClick.bind(this)}
                        nextClick={ExampleFunction.nextClick.bind(this)}
                        onSelectDate={ExampleFunction.onSelectDate.bind(this)}
                        onViewChange={ExampleFunction.onViewChange.bind(this)}
                        updateEventStart={ExampleFunction.updateEventStart.bind(this)}
                        updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
                        moveEvent={ExampleFunction.moveEvent.bind(this)}
                        newEvent={ExampleFunction.newEvent.bind(this)}
                        onSetAddMoreState={ExampleFunction.onSetAddMoreState.bind(this)}
                    />
                    {popover}
                </div>
            </div>
        );
    }

    public getDateLabel = (schedulerData: SchedulerData, viewType: number, startDate: string, endDate: string) => {
        const start = moment(startDate);
        const end = moment(endDate);
        let dateLabel = start.format("YYYY年M月D日");

        if (viewType === SchedulerViewTypes.Week) {
            dateLabel = `${start.format("YYYY年M月D日")}-${end.format("D日")}`;
            if (start.month() !== end.month()) {
                dateLabel = `${start.format("YYYY年M月D日")}-${end.format("M月D日")}`;
            }
            if (start.year() !== end.year()) {
                dateLabel = `${start.format("YYYY年M月D日")}-${end.format("YYYY年M月D日")}`;
            }
        } else if (viewType === SchedulerViewTypes.Month) {
            dateLabel = start.format("YYYY年M月");
        } else if (viewType === SchedulerViewTypes.Quarter) {
            dateLabel = `${start.format("YYYY年M月D日")}-${end.format("M月D日")}`;
        } else if (viewType === SchedulerViewTypes.Year) {
            dateLabel = start.format("YYYY年");
        }

        return dateLabel;
    }

    public isNonWorkingTime = (schedulerData: SchedulerData, time: string) => {
        if (schedulerData.viewType === SchedulerViewTypes.Day) {
            const hour = moment(time).hour();
            if (hour < 9 || hour > 18) {
                return true;
            }
        } else {
            const dayOfWeek = moment(time).weekday();
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                return true;
            }
        }

        return false;
    }
}

export default withDragDropContext(Locale);
