import React from 'react';

class FacturaIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2h12v16H4z" fill="none" stroke="currentColor" />
                <path d="M4 4h12v2H4z" fill="currentColor" />
                <path d="M4 8h8v2H4z" fill="currentColor" />
                <path d="M4 12h10v2H4z" fill="currentColor" />
                <path d="M4 16h6v2H4z" fill="currentColor" />
                <mask id="factura" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M4 2h12v16H4z" fill="none" stroke="currentColor" />
                </mask>
                <g mask="url(#factura)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default FacturaIcon;
