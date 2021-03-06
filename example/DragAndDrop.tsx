import * as React from "react";
import { Component } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Scheduler, { SchedulerData, SchedulerViewTypes, SchedulerDnDSource, SchedulerEvent, SchedulerEventGroup } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import { DnDTypes } from "../src/types/DnDTypes";
import TaskItem from "./TaskItem";
import TaskList from "./TaskList";
import ResourceItem from "./ResourceItem";
import ResourceList from "./ResourceList";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";
import { Event } from "../src/SchedulerData";
import * as ExampleFunction from "./ExampleFunctions";

interface DragAndDropState {
    viewModel: SchedulerData;
    taskDndSource: SchedulerDnDSource;
    resourceDndSource: SchedulerDnDSource;
}

interface View {
    viewName: string;
    viewType: number;
    showAgenda: boolean;
    isEventPerspective: boolean;
}

class DragAndDrop extends Component<{}, DragAndDropState> {
    constructor(props: Readonly<{}>) {
        super(props);

        const views: View[] = [
            { viewName: "Agenda View", viewType: SchedulerViewTypes.Month, showAgenda: true, isEventPerspective: false },
            { viewName: "Resource View", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: false },
            { viewName: "Task View", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: true },
        ];

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Month, false, false, {
            schedulerWidth: "80%",
            schedulerMaxHeight: 500,
            views,
        });

        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.state = {
            viewModel: schedulerData,
            taskDndSource: new SchedulerDnDSource((p: { task: any; }) => p.task, TaskItem, DnDTypes.TASK),
            resourceDndSource: new SchedulerDnDSource((p: { resource: any; }) => p.resource, ResourceItem, DnDTypes.RESOURCE),
        };
    }

    public render() {
        const { viewModel, taskDndSource, resourceDndSource } = this.state;
        const h3 = viewModel.isEventPerspective ? "Drag and drop from outside: Drag a resource and drop to the task view" : "Drag and drop from outside: Drag a task and drop to the resource view";

        const dndList = viewModel.isEventPerspective ? (
            <ResourceList schedulerData={viewModel} newEvent={ExampleFunction.newEvent.bind(this)} resourceDndSource={resourceDndSource} />
        ) : (
                <TaskList schedulerData={viewModel} newEvent={ExampleFunction.newEvent.bind(this)} taskDndSource={taskDndSource} />
            );

        // register the external DnDSources
        const dndSources = [taskDndSource, resourceDndSource];
        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: "center" }}>{h3}<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/DragAndDrop.js" /></h3>
                    <Row>
                        <Col span={20}>
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
                                subtitleGetter={this.subtitleGetter}
                                dndSources={dndSources}
                            />
                        </Col>
                        <Col span={4}>
                            {dndList}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
    public subtitleGetter = (schedulerData: SchedulerData, event: SchedulerEvent) => {
        return schedulerData.isEventPerspective ? schedulerData.getResourceById(event.resourceId).name : event.groupName;
    }
}

export default withDragDropContext(DragAndDrop);
