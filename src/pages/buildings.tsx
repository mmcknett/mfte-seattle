import React, { useEffect, useState, useCallback } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import firebase from '../db/firebase';
import 'firebase/firestore';


import Sorters from "../components/Sorters";
import SearchInput from "../components/SearchInput";
import { BuildingCard } from "../components/BuildingCard";
import IBuilding from "../interfaces/IBuilding";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";
import { Button, Modal, Nav, Tab, Row, Col } from "react-bootstrap";
import SavedHomesMap from "../components/SavedHomesMap";
import AllBuildingsList from '../components/SavedHomesList';
import Login from "../auth_components/Login";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import SavedHomesList from "../components/SavedHomesList";

const ref = firebase.firestore().collection("buildings"); 

const BuildingsPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

  const [allBuildings, setAllBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getAllBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setAllBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getAllBuildings()}, [getAllBuildings]); 

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("./")
    } catch {
      setError("Failed to log out")
    }
  }

  const [query, setQuery] = useState<string>("");
  const [activeSorter, setActiveSorter] = useState<ISorter<IBuilding>>({
    property: "buildingName",
    isDescending: false,
  });
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IBuilding>>>(
    []
  );

  const resultBuildings = allBuildings

    .filter((building) =>
      genericSearch<IBuilding>(building, 
        ["buildingName", "residentialTargetedArea", "streetNum", "street", "zip"],
        query
      )
    )
    .filter((building) => genericFilter<IBuilding>(building, activeFilters))
    .sort((buildingA, buildingB) =>
      genericSort<IBuilding>(buildingA, buildingB, activeSorter)
    );

  // Login
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  return (
    <>
      <div>
      {/* search filter container */}
      <div className="container mx-auto my-2">

        {/* search */}
        <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />

        {/* filter */}
        {allBuildings.length > 0 && <Filters<IBuilding>
          object={allBuildings[0]}
          filters={activeFilters}
          onChangeFilter={(changedFilterProperty, checked, isTruthyPicked) => {
            checked
              ? setActiveFilters([
                ...activeFilters.filter(
                  (filter) => filter.property !== changedFilterProperty
                ),
                { property: changedFilterProperty, isTruthyPicked },
              ])
              : setActiveFilters(
                activeFilters.filter(
                  (filter) => filter.property !== changedFilterProperty
                )
              );
          }}
        />}
      </div>

      {/* sort */}
      <section className="container-fluid">
        <div className="row">
          <div className="col-lg-4">
            <h3>Results:</h3>
            {allBuildings.length > 0 && <Sorters<IBuilding>
              object={allBuildings[0]}
              onChangeSorter={(property, isDescending) => {
                setActiveSorter({
                  property,
                  isDescending,
                });
              }}
            />}
          </div>
        </div>
      </section>
      </div>

        <>
          <Tab.Container id="sidebar" defaultActiveKey="saved-homes">
            <Row>
              <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="saved-homes" className="tab">Saved Homes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="map" className="tab">Map View</Nav.Link>
                </Nav.Item>
              </Nav>
              </Col>
              <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="saved-homes">
                  <SavedHomesList savedBuildings={resultBuildings}/>
                </Tab.Pane>
                <Tab.Pane eventKey="map">
                  <SavedHomesMap savedBuildings={resultBuildings}/>
                </Tab.Pane>
              </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </>
    </>
  )
}

export default withRouter(BuildingsPage);