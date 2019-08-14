import * as React from "react";
import { Component, CSSProperties } from "react";
import { SchedulerData, SlotClickedFuncArgs, SlotItemTemplateResolverArgs, ToggleExpandFuncArgs } from "./Scheduler";
import { RenderData } from "./SchedulerData";

import Icon from "antd/lib/icon";

interface ResourceViewProps {
    schedulerData: SchedulerData;
    contentScrollbarHeight: number;
    slotClickedFunc?: (args: SlotClickedFuncArgs) => void;
    slotItemTemplateResolver?: (args: SlotItemTemplateResolverArgs) => JSX.Element;
    toggleExpandFunc?: (args: ToggleExpandFuncArgs) => void;
}

class ResourceView extends Component<ResourceViewProps> {

    constructor(props: Readonly<ResourceViewProps>) {
        super(props);
    }

    public render() {

        const { schedulerData, contentScrollbarHeight, slotClickedFunc, slotItemTemplateResolver, toggleExpandFunc } = this.props;
        const { renderData } = schedulerData;

        const width = schedulerData.getResourceTableWidth() - 2;
        const paddingBottom = contentScrollbarHeight;
        const displayRenderData = renderData.filter((o) => o.render);
        const resourceList = displayRenderData.map((item) => {
            const indents = [];
            for (let i = 0; i < item.indent; i++) {
                indents.push(<span key={`es${i}`} className="expander-space"></span>);
            }
            let indent = <span key={`es${item.indent}`} className="expander-space"></span>;
            if (item.hasChildren) {
                indent = item.expanded ? (
                    <Icon type="minus-square" key={`es${item.indent}`} style={{}} className=""
                        onClick={() => {
                            if (!!toggleExpandFunc) {
                                toggleExpandFunc({schedulerData, slotId: item.slotId});
                            }
                        }} />
                ) : (
                        <Icon type="plus-square" key={`es${item.indent}`} style={{}} className=""
                            onClick={() => {
                                if (!!toggleExpandFunc) {
                                    toggleExpandFunc({schedulerData, slotId: item.slotId});
                                }
                            }} />
                    );
            }
            indents.push(indent);

            const a = slotClickedFunc != undefined ? <span className="slot-cell">{indents}<a className="slot-text" onClick={() => {
                slotClickedFunc({schedulerData, slot: item});
            }}>{item.slotName}</a></span>
                : <span className="slot-cell">{indents}<span className="slot-text">{item.slotName}</span></span>;
            let slotItem = (
                <div title={item.slotName} className="overflow-text header2-text" style={{ textAlign: "left" }}>
                    {a}
                </div>
            );
            if (!!slotItemTemplateResolver) {
                const temp = slotItemTemplateResolver({schedulerData, slot: item, slotClickedFunc, width, clsName: "overflow-text header2-text"});
                if (!!temp) {
                    slotItem = temp;
                }
            }

            const tdStyle: CSSProperties = { height: item.rowHeight };
            if (item.groupOnly) {
                tdStyle.backgroundColor = schedulerData.config.groupOnlySlotColor;
            }

            return (
                <tr key={item.slotId}>
                    <td data-resource-id={item.slotId} style={tdStyle}>
                        {slotItem}
                    </td>
                </tr>
            );
        });

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
