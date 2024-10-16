import React from 'react';

class CompraIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3h2l1 7h8l1 2H6" fill="none" stroke="currentColor" />
                <circle cx="7" cy="17" r="1" fill="currentColor" />
                <circle cx="15" cy="17" r="1" fill="currentColor" />
                <mask id="compra" mask-type="alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="14" height="18">
                    <path d="M5 3h2l1 7h8l1 2H6" fill="none" stroke="currentColor" />
                </mask>
                <g mask="url(#compra)">
                    <rect width="20" height="20" />
                </g>
            </svg>
        );
    }
}

export default CompraIcon;
