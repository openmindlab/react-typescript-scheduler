import * as React from 'react'
import { Component } from 'react'
import Scheduler, {
    SchedulerData, SchedulerDnDSource,
} from '../src/Scheduler'

class TaskList extends Component<{
    schedulerData: SchedulerData,
    newEvent: any,
    taskDndSource: SchedulerDnDSource
}, {}>{
    constructor(props: Readonly<{ schedulerData: SchedulerData; newEvent: any; taskDndSource: SchedulerDnDSource; }>) {
        super(props);
    }

    render() {
        const { schedulerData, newEvent, taskDndSource } = this.props;
        let DnDTaskItem = taskDndSource.getDragSource();
        let tasks = schedulerData.eventGroups;
        let taskList = tasks.map((item) => {
            return <DnDTaskItem key={item.id} task={item} newEvent={newEvent} schedulerData={schedulerData} />
        });

        return (
            <ul>
                {taskList}
            </ul>
        )
    }
}

export default TaskList
