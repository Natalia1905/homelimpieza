import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';

import UIIcons from '../../pages/components/icons';
import UINotifications from '../../pages/notifications';
import TablesStatic from '../../pages/tables/static';
import MapsGoogle from '../../pages/components/maps/google';
import CoreTypography from '../../pages/typography';
import Charts from '../../pages/components/charts/Charts';
import Dashboard from '../../pages/dashboard';
import Compra from '../../pages/compra/compra'; // Importa el componente Compra
import Promocion from '../../pages/promocion/promocion'; 
import Promoproducto from '../../pages/promoproducto/promoproducto'; 
import Proveedor from '../../pages/proveedor/proveedor'; 
import Factura from '../../pages/factura/factura'; 
import Factura_detalle from '../../pages/factura_detalle/factura_detalle';
import Super from '../../pages/Super/Super'; 
import HistorialCompras from '../../pages/historial_compras/historial_compras';

import Header from '../Header';
import Sidebar from '../Sidebar';
import BreadcrumbHistory from '../BreadcrumbHistory';
import { openSidebar, closeSidebar } from '../../actions/navigation';
import s from './Layout.module.scss';

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
  };

  constructor(props) {
    super(props);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  handleSwipe(e) {
    if ('ontouchstart' in window) {
      if (e.direction === 4 && !this.state.chatOpen) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }

      this.setState({ chatOpen: e.direction === 2 });
    }
  }

  render() {
    return (
      <div
        className={[
          s.root,
          'sidebar-' + this.props.sidebarPosition,
          'sidebar-' + this.props.sidebarVisibility,
        ].join(' ')}
      >
        <div className={s.wrap}>
          <Header />
          <Sidebar />
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <BreadcrumbHistory url={this.props.location.pathname} />
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                    <Route path="/app/main" exact render={() => <Redirect to="/app/main/dashboard" />} />
                    <Route path="/app/main/dashboard" exact component={Dashboard} />
                    <Route path="/app/components/icons" exact component={UIIcons} />
                    <Route path="/app/notifications" exact component={UINotifications} />
                    <Route path="/app/components/charts" exact component={Charts} />
                    <Route path="/app/tables" exact component={TablesStatic} />
                    <Route path="/app/components/maps" exact component={MapsGoogle} />
                    <Route path="/app/typography" exact component={CoreTypography} />
                    <Route path="/app/compra" exact component={Compra} /> {/* Añade la ruta para Compra */}
                    <Route path="/app/promocion" exact component={Promocion} /> {/* Añade la ruta */}
                    <Route path="/app/promoproducto" exact component={Promoproducto}/> {/* Añade la ruta  */}
                    <Route path="/app/proveedor" exact component={Proveedor}/> {/* Añade la ruta  */}
                    <Route path="/app/factura" exact component={Factura}/> {/* Añade la ruta  */}
                    <Route path="/app/factura_detalle" exact component={Factura_detalle}/> {/* Añade la ruta  */}
                    <Route path="/app/Super" exact component={Super}/> {/* Añade la ruta  */}
                    <Route path="/app/historial_compras" exact component={HistorialCompras}/>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              <footer className={s.contentFooter}>
                {/* Aquí puedes añadir contenido del pie de página si lo deseas */}
              </footer>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
