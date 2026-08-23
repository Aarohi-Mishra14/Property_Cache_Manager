import TopBar from '../components/TopBar.jsx';

export default function Settings() {
    return (
        <>
            <TopBar
                title="Settings"
                subtitle="Cache configuration currently in effect. Change these values in the backend .env file."
            />
            <div className="page-content">
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Setting</th>
                                <th scope="col">Value</th>
                                <th scope="col">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CACHE_TTL_PROPERTY_LIST</td>
                                <td>60 seconds</td>
                                <td>How long a properties list result stays cached per search/filter combination.</td>
                            </tr>
                            <tr>
                                <td>CACHE_TTL_PROPERTY_DETAIL</td>
                                <td>300 seconds</td>
                                <td>How long a single property's details stay cached.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
