import React from 'react';

class PromocionIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1l4 8H6l4-8z" fill="currentColor" />
                <path d="M4 12h12v6H4z" fill="none" stroke="currentColor" />
                <path d="M10 14l1.5-1.5h-3L10 14z" fill="currentColor" />
                <mask id="promocion" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M10 1l4 8H6l4-8z" fill="currentColor" />
                </mask>
                <g mask="url(#promocion)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default PromocionIcon;
