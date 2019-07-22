import * as React from "react";
import { Component } from "react";
import {
    SchedulerData,
} from "../src/Scheduler";

import DnDSource from "../src/DnDSource";

class ResourceList extends Component<{
    schedulerData: SchedulerData,
    newEvent: any,
    resourceDndSource: DnDSource,
}, {}> {
    constructor(props: Readonly<{ schedulerData: SchedulerData; newEvent: any; resourceDndSource: DnDSource; }>) {
        super(props);
    }

    public render() {
        const { schedulerData, newEvent, resourceDndSource } = this.props;
        const DnDResourceItem = resourceDndSource.getDragSource();
        const resources = schedulerData.resources;
        const resourceList = resources.map((item) => {
            return <DnDResourceItem key={item.id} resource={item} newEvent={newEvent} schedulerData={schedulerData} />;
        });

        return (
            <ul>
                {resourceList}
            </ul>
        );
    }
}

export default ResourceList;
