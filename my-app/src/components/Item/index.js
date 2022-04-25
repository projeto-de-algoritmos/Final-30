import './item.css'

export default function Item({ item, selectItem }) {
    return (
        <div data-tip data-for={item.name} className="itemClass" onClick={() => selectItem(item)}>
            <img src={item.icon} height={48} width={48} alt="Item img"/>
            <p style={{ fontSize: '8px', margin: 0 }}>P: {item.weight} - V: {item.value}</p>
        </div>
    )
}