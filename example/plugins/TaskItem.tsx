import * as React from "react";
import { Component } from "react";

class TaskItem extends Component
    <{
        task: any,
        isDragging: boolean,
        connectDragSource: (a?: any) => any,
        connectDragPreview: (a?: any) => any,
    }, {}> {
    constructor(props: Readonly<{ task: any; isDragging: boolean; connectDragSource: (a?: any) => any; connectDragPreview: (a?: any) => any; }>) {
        super(props);
    }

    public render() {
        const { task, isDragging, connectDragSource, connectDragPreview } = this.props;
        const dragContent = <li style={{ color: "red", fontWeight: "bold", fontSize: "20px", listStyle: "none" }}>{task.name}</li>;

        return (
            isDragging ? null : (
                <div>
                    {
                        connectDragPreview(
                            connectDragSource(dragContent),
                        )
                    }
                </div>
            )
        );
    }
}

export default TaskItem;
