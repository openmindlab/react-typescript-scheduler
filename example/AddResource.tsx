import moment from "moment";
import * as React from "react";
import { Component } from "react";
import Scheduler, { SchedulerData, SchedulerViewTypes, SCHEDULER_DATE_FORMAT } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";

interface AddResourceState {
    viewModel: SchedulerData;
    visible: boolean;
}

class AddResource extends Component<{}, AddResourceState> {
    public form: any;
    constructor(props: Readonly<{}>) {
        super(props);
        const today = moment().format(SCHEDULER_DATE_FORMAT);
        const schedulerData = new SchedulerData(today, SchedulerViewTypes.Week);
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
            visible: false,
        };
    }
    public showModal = () => {
        this.setState({ visible: true });
    }
    public handleCancel = () => {
        this.setState({ visible: false });
    }
    public handleCreate = () => {
        const form = this.form;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
            this.addResource(values.name);
            form.resetFields();
            this.setState({ visible: false });
        });

    }
    public saveFormRef = (form: any) => {
        this.form = form;
    }

    public addResource = (resourceName: string) => {
        const schedulerData = this.state.viewModel;
        const newFreshId = schedulerData.resources.length + 1;
        const newFreshName = resourceName;
        schedulerData.addResource({ id: newFreshId.toString(), name: newFreshName });
        this.setState({
            viewModel: schedulerData,
        });
    }

    public render() {
        const { viewModel } = this.state;

        const leftCustomHeader = (
            <div>
                <span style={{ fontWeight: "bold" }}><a onClick={this.showModal}>Add a resource</a></span>
                {/*TODO */}
            </div>
        );

        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: "center" }}>Add resource<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/AddResource.js" /></h3>
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
                        leftCustomHeader={leftCustomHeader}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default withDragDropContext(AddResource);
