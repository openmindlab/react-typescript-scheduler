import * as React from 'react'
import { Component } from 'react'
import Scheduler, {
    SchedulerResource
} from '../src/Scheduler'
class ResourceItem extends Component<{
    resource: SchedulerResource,
    isDragging: boolean,
    connectDragSource: (action: any) => any,
    connectDragPreview: (action: any) => any
}, {}>
{
    constructor(props: Readonly<{ resource: SchedulerResource; isDragging: boolean; connectDragSource: (action: any) => any; connectDragPreview: (action: any) => any; }>) {
        super(props);
    }

    render() {
        const { resource, isDragging, connectDragSource, connectDragPreview } = this.props;
        let dragContent = <li style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', listStyle: 'none' }}>{resource.name}</li>;

        return (
            isDragging ? null : (
                <div>
                    {
                        connectDragPreview(
                            connectDragSource(dragContent)
                        )
                    }
                </div>
            )
        )
    }
}

export default ResourceItem
