import React from "react";
import { RouteComponent } from "./route.tsx";
import "./style.css";
import type { Journey } from "./types";

class JourneyComponent extends React.Component {
    state: Journey
    constructor(props) {
      super(props);
      console.log(props)
      if (!this.state.name) {
        this.state.name="";
      }
      if (!this.state.routes) {
        this.state.routes = [];
      }
      // this.state = props;
      this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      // fetch some data and update `information` state
    }
    
    handleChange(event) {
      console.log(event, event.target.value)
      this.setState({value: event.target.value});
    }

    render() {
      let emptyRoute : Journey = {};
      return (
        <div>
          <h3>{ this.state.name }</h3>
          <table className="journey">
            <tr>
              <td>
                <span>Name of route</span>
              </td>
              <td>
                <input name="origin" value={this.state.name} />
              </td>
            </tr>
            <tr>
              <td colSpan="2"><hr /></td>
            </tr>
            <table>
              { this.state.routes.map(route => (
                <RouteComponent emptyRoute />
              ))}

            </table>
          </table>
        </div>
      )
    }
}

export { JourneyComponent as RoutePicker };
