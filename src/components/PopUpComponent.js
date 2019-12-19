import React from 'react'
import Button from 'react-bootstrap/Button'
import style from '../styles'

class PopUpComponent extends React.Component {
    render() {
        return (
            <div style={{ width: this.props.width, height: this.props.height }}>
                <div style={style.popup}>
                    <div style={style.popupInner}>
                        <div style={style.infoTextStyle}>
                            <div dangerouslySetInnerHTML={this.props.content} />
                            <Button variant="dark" onClick={this.props.closePopup}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUpComponent