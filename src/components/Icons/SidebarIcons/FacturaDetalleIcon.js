import React from 'react';

class FacturaDetalleIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 2h14v16H3z" fill="none" stroke="currentColor" />
                <path d="M3 2l1-1h10l1 1v16H3V2z" fill="currentColor" />
                <path d="M4 5h12v1H4z" fill="currentColor" />
                <path d="M4 8h10v1H4z" fill="currentColor" />
                <path d="M4 11h8v1H4z" fill="currentColor" />
                <path d="M4 14h6v1H4z" fill="currentColor" />
                <mask id="facturadetalle" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M3 2h14v16H3z" fill="none" stroke="currentColor" />
                </mask>
                <g mask="url(#facturadetalle)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default FacturaDetalleIcon;
