import React from 'react';

class PromoProductoIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3h12v12H4z" fill="none" stroke="currentColor" />
                <path d="M4 3l2-2h8l2 2v12H4V3z" fill="currentColor" />
                <path d="M8 6h4v6H8V6z" fill="none" stroke="currentColor" />
                <mask id="promoproducto" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M4 3h12v12H4z" fill="none" stroke="currentColor" />
                </mask>
                <g mask="url(#promoproducto)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default PromoProductoIcon;
