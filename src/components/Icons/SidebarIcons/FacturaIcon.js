import React from 'react';

class FacturaIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2h16v16H2z" fill="none" stroke="currentColor" />
                <path d="M4 4h12v12H4z" fill="currentColor" />
                <mask id="factura" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M2 2h16v16H2z" fill="none" stroke="currentColor" />
                </mask>
                <g mask="url(#factura)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default FacturaIcon;
