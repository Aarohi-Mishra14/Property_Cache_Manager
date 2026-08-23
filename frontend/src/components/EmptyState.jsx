export default function EmptyState({ title = 'No data found', hint }) {
    return (
        <div className="state-message">
            <div className="state-message-title">{title}</div>
            {hint && <div>{hint}</div>}
        </div>
    );
}
