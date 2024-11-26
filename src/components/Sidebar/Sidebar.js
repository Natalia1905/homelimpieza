import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {dismissAlert} from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';

import {changeActiveSidebarItem} from '../../actions/navigation';
import {logoutUser} from '../../actions/user';
import HomeIcon from '../Icons/SidebarIcons/HomeIcon';
import TypographyIcon from '../Icons/SidebarIcons/TypographyIcon';
import TablesIcon from '../Icons/SidebarIcons/TablesIcon';
import NotificationsIcon from '../Icons/SidebarIcons/NotificationsIcon';
import CompraIcon from '../Icons/SidebarIcons/CompraIcon';
import PromocionIcon from '../Icons/SidebarIcons/PromocionIcon';
import PromoProductoIcon from '../Icons/SidebarIcons/PromoProductoIcon';
import ProveedorIcon from '../Icons/SidebarIcons/ProveedorIcon';
import FacturaIcon from '../Icons/SidebarIcons/FacturaIcon';
import FacturaDetalleIcon from '../Icons/SidebarIcons/FacturaDetalleIcon';
import SuperIcon from '../Icons/SidebarIcons/SuperIcon';
import HistorialCompras from '../Icons/SidebarIcons/HistorialCompras';

class Sidebar extends React.Component {
    static propTypes = {
        sidebarStatic: PropTypes.bool,
        sidebarOpened: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        activeItem: PropTypes.string,
        location: PropTypes.shape({
            pathname: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        sidebarStatic: false,
        activeItem: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            rol: '1', // Valor inicial: '1' para admin
        };

        this.doLogout = this.doLogout.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
    }

    componentDidMount() {
        this.element.addEventListener('transitionend', () => {
            if (this.props.sidebarOpened) {
                this.element.classList.add(s.sidebarOpen);
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
            if (nextProps.sidebarOpened) {
                this.element.style.height = `${this.element.scrollHeight}px`;
            } else {
                this.element.classList.remove(s.sidebarOpen);
                setTimeout(() => {
                    this.element.style.height = '';
                }, 0);
            }
        }
    }

    dismissAlert(id) {
        this.props.dispatch(dismissAlert(id));
    }

    doLogout() {
        this.props.dispatch(logoutUser());
    }

    handleRoleChange(event) {
        this.setState({ rol: event.target.value });
    }

    render() {
        const { rol } = this.state;

        return (
            <nav
                className={cx(s.root)}
                ref={(nav) => {
                    this.element = nav;
                }}
            >
              <header className={s.logo}>
  <button className="link-button" onClick={() => {/* lógica de navegación */}}>
    Hogar <span className="fw-bold">y Limpieza</span>
  </button>
</header>
                
                {/* Selector de rol */}
                <select  className={s.roleSelect}  onChange={this.handleRoleChange} value={rol}>
                    <option value="1">Administrador</option>
                    <option value="2">Coordinador</option>
                    <option value="3">Analista</option>
                </select>

                <ul className={s.nav}>
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Dashboard"
                        isHeader
                        iconName={<HomeIcon className={s.menuIcon} />}
                        link="/app/main"
                        index="main"
                    />
                    <h5 className={[s.navTitle, s.groupTitle].join(' ')}>TEMPLATE</h5>

                    {rol === '1' && (
                        <>
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Productos"
                                isHeader
                                iconName={<TypographyIcon className={s.menuIcon} />}
                                link="/app/typography"
                                index="core"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Categoria" 
                                isHeader
                                iconName={<TablesIcon className={s.menuIcon} />}
                                link="/app/tables"
                                index="tables"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Categoria Área"
                                isHeader
                                iconName={<SuperIcon className={s.menuIcon} />}
                                link="/app/super"
                                index="super"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Inventario"
                                isHeader
                                iconName={<NotificationsIcon className={s.menuIcon}/> }
                                link="/app/notifications"
                                index="ui"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Compra Producto"
                                isHeader
                                iconName={<CompraIcon className={s.menuIcon}/> }
                                link="/app/compra"
                                index="compra"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Promocion"
                                isHeader
                                iconName={<PromocionIcon className={s.menuIcon}/> }
                                link="/app/promocion"
                                index="promocion"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Promocion Producto"
                                isHeader
                                iconName={<PromoProductoIcon className={s.menuIcon}/> }
                                link="/app/promoproducto"
                                index="promoproducto"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Proveedor"
                                isHeader
                                iconName={<ProveedorIcon className={s.menuIcon}/> }
                                link="/app/proveedor"
                                index="proveedor"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Factura"
                                isHeader
                                iconName={<FacturaIcon className={s.menuIcon}/> }
                                link="/app/factura"
                                index="factura"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Factura a Detalle"
                                isHeader
                                iconName={<FacturaDetalleIcon className={s.menuIcon}/> }
                                link="/app/factura_detalle"
                                index="factura_detalle"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Historial Compras"
                                isHeader
                                iconName={<HistorialCompras className={s.menuIcon}/> }
                                link="/app/historial_compras"
                                index="historial_compras"
                            />

                        </>
                    )}

                    {rol === '2' && (
                        <>
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Productos"
                                isHeader
                                iconName={<TypographyIcon className={s.menuIcon} />}
                                link="/app/typography"
                                index="core"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Categoria"
                                isHeader
                                iconName={<TablesIcon className={s.menuIcon} />}
                                link="/app/tables"
                                index="tables"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Categoria Superficie"
                                isHeader
                                iconName={<SuperIcon className={s.menuIcon} />}
                                link="/app/super"
                                index="super"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Inventario"
                                isHeader
                                iconName={<NotificationsIcon className={s.menuIcon}/> }
                                link="/app/notifications"
                                index="ui"
                            />
                        </>
                    )}

                    {rol === '3' && (
                        <>
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Inventario"
                                isHeader
                                iconName={<NotificationsIcon className={s.menuIcon}/> }
                                link="/app/notifications"
                                index="ui"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Compra Producto"
                                isHeader
                                iconName={<CompraIcon className={s.menuIcon}/> }
                                link="/app/compra"
                                index="compra"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Factura"
                                isHeader
                                iconName={<FacturaIcon className={s.menuIcon}/> }
                                link="/app/factura"
                                index="factura"
                            />
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Factura a Detalle"
                                isHeader
                                iconName={<FacturaDetalleIcon className={s.menuIcon}/> }
                                link="/app/factura_detalle"
                                index="factura_detalle"
                            />
                        </>
                    )}
                </ul>
            </nav>
        );
    }
}

function mapStateToProps(store) {
    return {
        sidebarOpened: store.navigation.sidebarOpened,
        sidebarStatic: store.navigation.sidebarStatic,
        alertsList: store.alerts.alertsList,
        activeItem: store.navigation.activeItem,
    };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
