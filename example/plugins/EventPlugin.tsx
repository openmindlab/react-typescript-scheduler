import * as React from "react";
import { Component } from "react";
import {
    EventItemPluginArgs,
} from "../../src/Scheduler";

export class EventComponent extends Component<{ args: EventItemPluginArgs }, {}> {
    constructor(props: Readonly<{ args: EventItemPluginArgs; }>) {
        super(props);
    }
    public render() {
        const borderWidth = this.props.args.isStart ? "4" : "0";
        let borderColor = "rgba(0,139,236,1)";
        let backgroundColor = "#80C5F6";
        const titleText = this.props.args.schedulerData.behaviors.getEventTextFunc(this.props.args.schedulerData, this.props.args.event);
        if (!!this.props.args.event.type) {
            borderColor = this.props.args.event.type == 1 ? "rgba(0,139,236,1)" : (this.props.args.event.type == 3 ? "rgba(245,60,43,1)" : "#999");
            backgroundColor = this.props.args.event.type == 1 ? "#80C5F6" : (this.props.args.event.type == 3 ? "#FA9E95" : "#D9D9D9");
        }
        let divStyle = { borderLeft: borderWidth + "px solid " + borderColor, backgroundColor, height: this.props.args.mustBeHeight, maxWidth: undefined };
        if (!!this.props.args.agendaMaxEventWidth) {
            divStyle = { ...divStyle, maxWidth: this.props.args.agendaMaxEventWidth };
        }

        return <div key={this.props.args.event.id} className={this.props.args.mustAddCssClass} style={divStyle}>
            <span style={{ marginLeft: "4px", lineHeight: `${this.props.args.mustBeHeight}px` }}>{titleText}</span>
        </div>;
    }
}
