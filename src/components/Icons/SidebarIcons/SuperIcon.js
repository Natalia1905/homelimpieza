import React from 'react';

class SuperIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 2H3C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V8C18 7.44772 17.5523 7 17 7H9L8 2ZM3 4H7L8 6H17V17H3V4Z" />
            </svg>
        );
    }
}

export default SuperIcon;
