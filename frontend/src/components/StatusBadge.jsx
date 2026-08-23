const STATUS_STYLES = {
    available: { className: 'badge-success', label: 'Available' },
    sold: { className: 'badge-neutral', label: 'Sold' },
    rented: { className: 'badge-warning', label: 'Rented' },
};

export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || { className: 'badge-neutral', label: status };
    return <span className={`badge ${style.className}`}>{style.label}</span>;
}
