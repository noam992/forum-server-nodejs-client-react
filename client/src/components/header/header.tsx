import React,{ Component } from "react";
import "./header.css";
import { Menu } from "../menu/menu";

export class Header extends Component {
    public render () {
        return (
            <div className="header">
                <Menu /> 
            </div>
        )
    }
}