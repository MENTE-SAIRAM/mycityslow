import { Helmet } from 'react-helmet-async';

export default function Privacy() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
            <Helmet>
                <title>Privacy Policy — My City Slow</title>
                <meta
                    name="description"
                    content="Read how My City Slow collects, uses, and protects your personal information."
                />
                <link rel="canonical" href="https://mycityslow.com/privacy" />
            </Helmet>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Privacy Policy</h1>
            <p className="text-sage-light mb-12">Last updated: May 3, 2026</p>

            <div className="space-y-10 text-sage-light leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
                    <p>
                        We may collect information you provide directly, such as your name, email address,
                        account details, submitted reviews, and spot contributions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Information</h2>
                    <p>
                        We use your information to operate the platform, improve recommendations,
                        manage accounts, moderate content, and communicate service updates.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">3. Location Data</h2>
                    <p>
                        If you enable location features, we may use your location to show nearby peaceful spots.
                        You can disable location access at any time in your browser or device settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">4. Cookies and Similar Technologies</h2>
                    <p>
                        We may use cookies and local storage for login sessions, preferences, and analytics.
                        You can control cookies through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">5. Sharing of Information</h2>
                    <p>
                        We do not sell personal data. We may share limited information with trusted service providers
                        who help us run the platform, subject to confidentiality and security obligations.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">6. Data Retention</h2>
                    <p>
                        We retain personal information only as long as needed for service operation,
                        legal compliance, and legitimate business purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">7. Data Security</h2>
                    <p>
                        We apply reasonable technical and organizational measures to protect your information.
                        However, no method of transmission or storage is completely secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">8. Your Rights</h2>
                    <p>
                        Depending on your region, you may have rights to access, update, delete,
                        or restrict processing of your personal information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">9. Children’s Privacy</h2>
                    <p>
                        My City Slow is not intended for children under 13, and we do not knowingly collect
                        personal information from children without appropriate legal basis.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">10. Changes to this Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be posted on this page
                        with an updated effective date.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">11. Contact</h2>
                    <p>
                        For privacy-related questions, contact us at
                        <span className="text-white font-semibold"> privacy@mycityslow.com</span>.
                    </p>
                </section>
            </div>
        </div>
    );
}
