import React from 'react';

class ProveedorIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="6" r="4" fill="currentColor" />
                <path d="M2 18c0-6 8-6 8 0H2z" fill="currentColor" />
                <path d="M12 18c0-6 8-6 8 0H12z" fill="none" stroke="currentColor" />
                <mask id="proveedor" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="1" width="16" height="18">
                    <circle cx="10" cy="6" r="4" fill="currentColor" />
                </mask>
                <g mask="url(#proveedor)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default ProveedorIcon;
