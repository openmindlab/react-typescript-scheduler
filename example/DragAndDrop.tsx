import * as React from 'react'
import { Component } from 'react'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Scheduler, { SchedulerData, SchedulerViewTypes, SchedulerDnDSource, SchedulerEvent, SchedulerEventGroup } from '../src/Scheduler'
import { DemoData } from './DemoData'
import { DnDTypes } from '../src/types/DnDTypes'
import TaskItem from './TaskItem'
import TaskList from './TaskList'
import ResourceItem from './ResourceItem'
import ResourceList from './ResourceList'
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import { Event } from '../src/SchedulerData'

interface DragAndDropState {
    viewModel: SchedulerData,
    taskDndSource: SchedulerDnDSource,
    resourceDndSource: SchedulerDnDSource
}

interface View {
    viewName: string,
    viewType: number,
    showAgenda: boolean,
    isEventPerspective: boolean
}

class DragAndDrop extends Component<{}, DragAndDropState>{
    constructor(props: Readonly<{}>) {
        super(props);

        let views: View[] = [
            { viewName: 'Agenda View', viewType: SchedulerViewTypes.Month, showAgenda: true, isEventPerspective: false },
            { viewName: 'Resource View', viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: false },
            { viewName: 'Task View', viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: true },
        ]

        let schedulerData = new SchedulerData('2017-12-18', SchedulerViewTypes.Month, false, false, {
            schedulerWidth: '80%',
            schedulerMaxHeight: 500,
            views: views
        });

        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.state = {
            viewModel: schedulerData,
            taskDndSource: new SchedulerDnDSource((props: { task: any; }) => { return props.task; }, TaskItem, DnDTypes.TASK),
            resourceDndSource: new SchedulerDnDSource((props: { resource: any; }) => { return props.resource; }, ResourceItem, DnDTypes.RESOURCE),
        }
    }

    render() {
        const { viewModel, taskDndSource, resourceDndSource } = this.state;
        let h3 = viewModel.isEventPerspective ? 'Drag and drop from outside: Drag a resource and drop to the task view' : 'Drag and drop from outside: Drag a task and drop to the resource view';

        let dndList = viewModel.isEventPerspective ? (
            <ResourceList schedulerData={viewModel} newEvent={this.newEvent} resourceDndSource={resourceDndSource} />
        ) : (
                <TaskList schedulerData={viewModel} newEvent={this.newEvent} taskDndSource={taskDndSource} />
            );

        //register the external DnDSources
        let dndSources = [taskDndSource, resourceDndSource];
        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: 'center' }}>{h3}<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/DragAndDrop.js" /></h3>
                    <Row>
                        <Col span={20}>
                            <Scheduler schedulerData={viewModel}
                                prevClick={this.prevClick}
                                nextClick={this.nextClick}
                                onSelectDate={this.onSelectDate}
                                onViewChange={this.onViewChange}
                                eventItemClick={this.eventClicked}
                                viewEventClick={this.ops1}
                                viewEventText="Ops 1"
                                viewEvent2Text="Ops 2"
                                viewEvent2Click={this.ops2}
                                updateEventStart={this.updateEventStart}
                                updateEventEnd={this.updateEventEnd}
                                moveEvent={this.moveEvent}
                                movingEvent={this.movingEvent}
                                newEvent={this.newEvent}
                                subtitleGetter={this.subtitleGetter}
                                dndSources={dndSources}
                                toggleExpandFunc={this.toggleExpandFunc}
                            />
                        </Col>
                        <Col span={4}>
                            {dndList}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    prevClick = (schedulerData: SchedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData: SchedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData: SchedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.config.creatable = !view.isEventPerspective;
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.setState({
            viewModel: schedulerData
        })
    }

    onSelectDate = (schedulerData: SchedulerData, date: string) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(DemoData.eventsForTaskView);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData: SchedulerData, event: Event) => {
        alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops1 = (schedulerData: SchedulerData, event: Event) => {
        alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops2 = (schedulerData: SchedulerData, event: Event) => {
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    newEvent = (schedulerData: SchedulerData, slotId: string, slotName: string, start: string, end: string, type: string, item: any) => {
        if (confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {

            let newFreshId = "0";
            schedulerData.events.forEach((item) => {
                if (item.id >= newFreshId)
                    newFreshId = item.id + 1;
            });

            let newEvent: Event = {
                id: newFreshId,
                title: 'New event you just created',
                start: start,
                end: end,
                resourceId: slotId,
                bgColor: 'purple'
            }

            if (type === DnDTypes.RESOURCE) {
                newEvent.groupId = slotId;
                newEvent.groupName = slotName;
                newEvent.resourceId = item.id
            }
            else if (type === DnDTypes.TASK) {
                newEvent.groupId = item.id,
                    newEvent.groupName = item.name
            }

            schedulerData.addEvent(newEvent);
            this.setState({
                viewModel: schedulerData
            })
        }
    }

    updateEventStart = (schedulerData: SchedulerData, event: Event, newStart: string) => {
        if (confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
            schedulerData.updateEventStart(event, newStart);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData: SchedulerData, event: Event, newEnd: string) => {
        if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
            schedulerData.updateEventEnd(event, newEnd);
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    moveEvent = (schedulerData: SchedulerData, event: Event, slotId: string, slotName: string, start: string, end: string) => {
        if (confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            this.setState({
                viewModel: schedulerData
            })
        }
    }

    movingEvent = (schedulerData: SchedulerData, slotId: string, slotName: string, newStart: string, newEnd: string, action: any, type: string, item: Event) => {
        console.log('moving event', schedulerData, slotId, slotName, newStart, newEnd, action, type, item);
    }

    subtitleGetter = (schedulerData: SchedulerData, event: Event) => {
        let res = schedulerData.getResourceById(event.resourceId)
        return schedulerData.isEventPerspective && res ? res.name : event.groupName;
    }

    toggleExpandFunc = (schedulerData: SchedulerData, slotId: string) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData
        });
    }
}

export default withDragDropContext(DragAndDrop)
