export default function HelpPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Help</h1>
                <p className="text-dark-400 mt-1">Guides and support for using the CMS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-3">Quick Start</h2>
                    <ul className="space-y-2 text-sm text-dark-300">
                        <li>1. Add cities from the Cities tab.</li>
                        <li>2. Create or edit spots from the Spots tab.</li>
                        <li>3. Approve incoming submissions from the Submissions tab.</li>
                        <li>4. Review spot listing on frontend to confirm output.</li>
                    </ul>
                </div>

                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-3">Need Support?</h2>
                    <p className="text-sm text-dark-300 mb-3">
                        If something is not working, check network/API status and ensure backend is running.
                    </p>
                    <p className="text-sm text-dark-300">
                        For urgent issues, contact the project maintainer.
                    </p>
                </div>
            </div>
        </div>
    );
}
