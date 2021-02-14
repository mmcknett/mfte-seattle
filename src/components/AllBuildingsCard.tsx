import * as React from "react";
import Iframe from 'react-iframe'
import app from "../db/firebase";
// import Moment from "react-moment";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup, ListGroupItem, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact"
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";

export function SavedHomesCard(props: IBuilding) {
  const { currentUser } = useAuth() as any
  const {
    buildingID,
    buildingName,
    phone,
    residentialTargetedArea,
    totalRestrictedUnits,
    studioUnits,
    oneBedroomUnits, 
    twoBedroomUnits,
    threePlusBedroomUnits,
    urlforBuilding,
    streetNum,
    street, 
    city,
    state, 
    zip,
  } = props;

  return (
<div className="building-card">
      <Card>
        <Card.Img variant="top" src="" />
        <Card.Body>
          <Card.Title>
            <h5 className="card-title"> {
              <a id="myLink" 
                href={urlforBuilding} 
                target="_blank" 
                rel="noreferrer">
                {buildingName}
              </a>
            }</h5>
          </Card.Title>
          
          <Card.Text>
          <h6 className="card-title">{residentialTargetedArea}</h6>
            <text>{streetNum} {street}</text>
              <br></br>
              <p>{city}, {state} {zip}</p>
              <p>{phone}</p>
          </Card.Text>
        </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              <h6> Total MFTE Units: {totalRestrictedUnits}</h6>
              <text> Studios: {studioUnits}</text>
              <br></br>
              <text>One beds: {oneBedroomUnits}</text>
              <br></br>
              <text>Two beds: {twoBedroomUnits}</text>
              <br></br>
              <text>Three+ beds: {threePlusBedroomUnits}</text>
            </ListGroupItem>
          </ListGroup>
        {/* <Card.Body>
          <a className="btn btn-outline-secondary btn-sm standalone-btn" 
            href={urlforBuilding} 
            target="_blank" 
            rel="noreferrer">
            Open Website
          </a>
        </Card.Body> */}
      </Card>
    </div>
  );
}