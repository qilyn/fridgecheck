import React from "react";
import type { Route } from "./types";

class RouteComponent extends React.Component<Route> {
  render() {
    return (
      <tr className="routes">
      <td>
        <span>Bus routes</span>
      </td>
      <td>
        <input name="newRoute" />
        <table>
          <tr>
            <td>
              This is a stop at one end of this route
            </td>
            <td>
              <input />
            </td>
            <td>
              <button name="Plus">+</button>
            </td>
          </tr>
        </table>
        <table>
          <tr>
            <td>
              This is a stop at the other end of this route
            </td>
            <td>
              <input />
            </td>
            <td>
              <button name="Plus">+</button>
            </td>
          </tr>
        </table>
      </td>
      <td>
        <button name="Plus">+</button>
      </td>
    </tr>
    )
  }
}

export { RouteComponent };
