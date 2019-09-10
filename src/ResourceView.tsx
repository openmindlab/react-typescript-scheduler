import * as React from "react";
import { Component } from "react";
import { SchedulerData, RowHeaderProps } from "./Scheduler";

interface ResourceViewProps {
    schedulerData: SchedulerData;
    contentScrollbarHeight: number;
    RowHeaderFC?: React.FC<RowHeaderProps>;
}

class ResourceView extends Component<ResourceViewProps> {
    constructor(props: Readonly<ResourceViewProps>) {
        super(props);
    }
    public render() {

        const { schedulerData, contentScrollbarHeight, RowHeaderFC } = this.props;
        const { renderData } = schedulerData;

        const width = schedulerData.getResourceTableWidth() - 2;
        const paddingBottom = contentScrollbarHeight;
        const displayRenderData = renderData.filter((o) => o.render);
        let resourceList = [<div className="InternalError">Missing RowHeaderFC!</div>];
        if (RowHeaderFC) {
            resourceList = displayRenderData.map((item) =>
                <RowHeaderFC key={item.slotId} schedulerData={schedulerData} item={item} width={width}/>,
            );
        }

        return (
            <div style={{ paddingBottom }}>
                <table className="resource-table">
                    <tbody>
                        {resourceList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResourceView;
