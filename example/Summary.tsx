import * as React from "react";
import { Component } from "react";
import Scheduler, { SchedulerData, SchedulerSummaryPos, SchedulerViewTypes } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
import withDragDropContext from "./withDnDContext";

class Summary extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Week, false, false, undefined, {
            getSummaryFunc: this.getSummary,
        });
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
        };
    }

    public render() {
        const { viewModel } = this.state;

        const leftCustomHeader = (
            <div><span style={{ fontWeight: "bold" }}><a onClick={this.changeSummaryPos}>Change summary position</a></span></div>
        );

        return (
            <Nav title="Summary">
                <Scheduler schedulerData={viewModel}
                    prevClick={ExampleFunction.prevClick.bind(this)}
                    nextClick={ExampleFunction.nextClick.bind(this)}
                    onSelectDate={ExampleFunction.onSelectDate.bind(this)}
                    onViewChange={ExampleFunction.onViewChange.bind(this)}
                    eventItemClick={ExampleFunction.eventClicked.bind(this)}
                    viewEventClick={ExampleFunction.ops1.bind(this)}
                    viewEventText="Ops 1"
                    viewEvent2Text="Ops 2"
                    viewEvent2Click={ExampleFunction.ops2.bind(this)}
                    updateEventStart={ExampleFunction.updateEventStart.bind(this)}
                    updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
                    moveEvent={ExampleFunction.moveEvent.bind(this)}
                    newEvent={ExampleFunction.newEvent.bind(this)}
                    toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    onSetAddMoreState={ExampleFunction.onSetAddMoreState.bind(this)}
                    leftCustomHeader={leftCustomHeader}
                />
            </Nav>
        );
    }

    public getSummary = (schedulerData: SchedulerData, headerEvents: any, slotId: string, slotName: string, headerStart: string, headerEnd: string) => {
        const text = headerEvents.length.toString();
        let color = "#d9d9d9";
        if (headerEvents.length > 0) {
            color = headerEvents.length <= 1 ? "green" : "red";
        }
        return { text, color, fontSize: "12px" };
    }

    public changeSummaryPos = () => {
        const schedulerData = this.state.viewModel;
        schedulerData.config.summaryPos = schedulerData.config.summaryPos === SchedulerSummaryPos.TopRight ? SchedulerSummaryPos.BottomRight : SchedulerSummaryPos.TopRight;
        this.setState({
            viewModel: schedulerData,
        });
    }

}

export default withDragDropContext(Summary);
