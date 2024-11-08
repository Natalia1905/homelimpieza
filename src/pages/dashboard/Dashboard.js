import React from "react";
import { Row, Col, Progress, Table, Label, Input } from "reactstrap";

import Widget from "../../components/Widget";

import Calendar from "./components/calendar/Calendar";
import Map from "./components/am4chartMap/am4chartMap";
import Rickshaw from "./components/rickshaw/Rickshaw";

import AnimateNumber from "react-animated-number";

import s from "./Dashboard.module.scss";

import peopleA1 from "../../assets/people/a1.jpg";
import peopleA5 from "../../assets/people/a5.jpg";
import peopleA4 from "../../assets/people/a4.jpg";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: null,
      checkedArr: [false, false, false],
    };
    this.checkTable = this.checkTable.bind(this);
  }

  checkTable(id) {
    let arr = [];
    if (id === 0) {
      const val = !this.state.checkedArr[0];
      for (let i = 0; i < this.state.checkedArr.length; i += 1) {
        arr[i] = val;
      }
    } else {
      arr = this.state.checkedArr;
      arr[id] = !arr[id];
    }
    if (arr[0]) {
      let count = 1;
      for (let i = 1; i < arr.length; i += 1) {
        if (arr[i]) {
          count += 1;
        }
      }
      if (count !== arr.length) {
        arr[0] = !arr[0];
      }
    }
    this.setState({
      checkedArr: arr,
    });
  }

  render() {
    return (
      <div className={s.root}>
     <h1 className="page-title" style={{ fontWeight: 'bold' }}>
          HOGAR Y LIMPIEZA &nbsp;
          <small>
            <small>Productos de limpieza</small>
          </small>
        </h1>

        <Row>
          <Col lg={7}>
            <Widget className="bg-transparent">
              <Map />
            </Widget>
          </Col>
          <Col lg={1} />

          <Col lg={4}>
            <Widget
              className="bg-transparent"
              title={
                <h5>
                  {" "}
                  
                  <span className="fw-semi-bold">&nbsp;Datos recientes (3 años)</span>
                </h5>
              }
              settings
              refresh
              close
            >
              <p>
                Status: <strong>Live</strong>
              </p>
              <p>
                <span className="circle bg-default text-white">
                  <i className="fa fa-map-marker" />
                </span>{" "}
                &nbsp; 2 Paises, 250 Ciudades
              </p>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Visitas Locales </h6>
                  <p className="description deemphasize mb-xs text-white">
                    2 0 2 1 - 2 0 2 5
                  </p>
                  <Progress
                    color="danger"
                    value="55"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={55} />%
                    </small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">  Visitas Globales</h6>
                  <p className="description deemphasize mb-xs text-white">
                    2 0 2 1 - 2 0 2 5
                  </p>
                  <Progress
                    color="warning"
                    value="75"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={75} />%
                    </small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Frecuencias </h6>
                  <p className="description deemphasize mb-xs text-white">
                    Clientes 
                  </p>
                  <Progress
                    color="success"
                    value="92"
                    className="bg-subtle-blue progress-xs"
                  />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small>
                      <AnimateNumber value={92} />%
                    </small>
                  </span>
                </div>
              </div>
             
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={6} xl={4} xs={12}>
            <Widget title={<h6> CRECIMIENTO LOCAL</h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Crecimiento Total</h6>
                  <p className="value">50.38%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">Mensual</h6>
                  <p className="value">70.38%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">24h</h6>
                  <p className="value">2.38%</p>
                </div>
              </div>
              <Progress
                color="danger"
                value="60"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-chevron-up" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;10% más</span>
                &nbsp;que el mes pasado
              </p>
            </Widget>
          </Col>
          <Col lg={6} xl={4} xs={12}>
            <Widget title={<h6> CRECIMIENTO GLOBAL </h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Crecimiento Total</h6>
                  <p className="value">77.33%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">Mensual</h6>
                  <p className="value">85.54%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">24h</h6>
                  <p className="value">80.23%</p>
                </div>
              </div>
              <Progress
                color="warning"
                value="79"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-chevron-down" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;17% más</span>
                &nbsp;que el mes pasado 
              </p>
            </Widget>
          </Col>
          <Col lg={6} xl={4} xs={12}>
            <Widget title={<h6> FRECUENCIAS </h6>} close settings>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name fs-sm">Crecimiento Total</h6>
                  <p className="value">98.34%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name fs-sm">Mensual</h6>
                  <p className="value">94.29%</p>
                </div>
                <div className="stat-item">
                  <h6 className="name fs-sm">24h</h6>
                  <p className="value">93%</p>
                </div>
              </div>
              <Progress
                color="bg-success"
                value="95"
                className="bg-subtle-blue progress-xs"
              />
              <p>
                <small>
                  <span className="circle bg-default text-white mr-2">
                    <i className="fa fa-plus" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;20% más</span>
                &nbsp;que el mes pasado
              </p>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={4} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="badge badge-success mr-2">Nuevos</span> Mensajes
                </h6>
              }
              refresh
              close
            >
              <div className="widget-body undo_padding">
                <div className="list-group list-group-lg">
                 
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA4}
                        alt="..."
                      />
                      <i className="status status-bottom bg-success" />
                    </span>
                    <div>
                      <h6 className="m-0">Michael Guzman</h6>
                      <p className="help-block text-ellipsis m-0">
                        Buenas noticias.
                      </p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA1}
                        alt="..."
                      />
                      <i className="status status-bottom bg-primary" />
                    </span>
                    <div>
                      <h6 className="m-0">Natalia Martínez</h6>
                      <p className="help-block text-ellipsis m-0">
                        Productos actualizados!
                      </p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img
                        className="rounded-circle"
                        src={peopleA5}
                        alt="..."
                      />
                      <i className="status status-bottom bg-danger" />
                    </span>
                    <div>
                      <h6 className="m-0">Fernando Olvera</h6>
                      <p className="help-block text-ellipsis m-0">
                        Qué actualización hay esta semana?
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              <footer className="bg-widget-transparent mt">
                <input
                  type="search"
                  className="form-control form-control-sm bg-custom-dark border-0"
                  placeholder="Search"
                />
              </footer>
            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget
              title={
                <h6>
                  {" "}
                  Ventas <span className="fw-semi-bold">Estrellas</span>
                </h6>
              }
              close
            >
              <div className="widget-body">
                <h3>POR DIA</h3>
                <p className="fs-mini text-muted mb mt-sm">
                 Mejores <span className="fw-semi-bold"></span> categorias
                  con <span className="fw-semi-bold">mayor</span> rachas.
                </p>
              </div>
              <div className={`widget-table-overflow ${s.table}`}>
                <Table striped size="sm">
                  <thead className="no-bd">
                    <tr>
                      <th>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox210"
                            type="checkbox"
                            onClick={() => this.checkTable(0)}
                            checked={this.state.checkedArr[0]}
                            readOnly
                          />{" "}
                          <Label for="checkbox210" />
                        </div>
                      </th>
                      <td>Oficinas</td>
                      <td className="text-align-right fw-semi-bold">$346.1</td>
                     
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox212"
                            type="checkbox"
                            onClick={() => this.checkTable(1)}
                            checked={this.state.checkedArr[1]}
                            readOnly
                          />{" "}
                          <Label for="checkbox212" />
                        </div>
                      </td>
                      <td>Oficinas</td>
                      <td className="text-align-right fw-semi-bold">$346.1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox214"
                            onClick={() => this.checkTable(2)}
                            type="checkbox"
                            checked={this.state.checkedArr[2]}
                            readOnly
                          />{" "}
                          <Label for="checkbox214" />
                        </div>
                      </td>
                      <td>Hogar</td>
                      <td className="text-align-right fw-semi-bold">$533.1</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div
                className="widget-body mt-xlg chart-overflow-bottom"
                style={{ height: "100px" }}
              >
                <Rickshaw height={100} />
              </div>
            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget
              title={<h6>Calendario</h6>}
              settings
              close
              bodyClass={"pt-2 px-0 py-0"}
            >
              <Calendar />
              <div className="list-group fs-mini">
                <button className="list-group-item text-ellipsis">
                  <span className="badge badge-pill badge-success float-right">
                    6:45
                  </span>
                  Actualizar tablas cada semana
                </button>
                <button className="list-group-item text-ellipsis">
                  <span className="badge badge-pill badge-danger float-right">
                    9:41
                  </span>
                  Mantenimiento sistema domingos
                </button>
              </div>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
