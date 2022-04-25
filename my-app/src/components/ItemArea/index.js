import './itemArea.css'

export default function ItemArea(props) {
    return (
        <div className="itemAreaClass">
            {props.children}
        </div>
    )
}