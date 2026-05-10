import { Helmet } from 'react-helmet-async';

export default function Terms() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
            <Helmet>
                <title>Terms & Conditions — My City Slow</title>
                <meta
                    name="description"
                    content="Read the Terms and Conditions for using My City Slow, including account use, content guidelines, and limitations of liability."
                />
                <link rel="canonical" href="https://mycityslow.com/terms" />
            </Helmet>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Terms & Conditions</h1>
            <p className="text-sage-light mb-12">Last updated: May 3, 2026</p>

            <div className="space-y-10 text-sage-light leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using My City Slow, you agree to these Terms & Conditions and our Privacy Policy.
                        If you do not agree, please do not use the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">2. Use of the Platform</h2>
                    <p>
                        You agree to use the platform only for lawful purposes and in a way that does not harm,
                        disable, or interfere with the platform or other users.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">3. Accounts and Security</h2>
                    <p>
                        If you create an account, you are responsible for maintaining the confidentiality of your
                        credentials and all activities that occur under your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">4. User Content</h2>
                    <p>
                        Content submitted by users (such as reviews, spot details, or photos) must be accurate,
                        respectful, and lawful. We may remove content that violates these terms or community standards.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">5. Intellectual Property</h2>
                    <p>
                        All platform design, branding, and original content are owned by My City Slow or its licensors.
                        You may not copy, distribute, or reuse platform materials without permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">6. Third-Party Services</h2>
                    <p>
                        We may integrate third-party services (for example maps, authentication, or media services).
                        Their use is subject to their own terms and policies.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">7. Disclaimer</h2>
                    <p>
                        The platform is provided on an "as is" and "as available" basis without warranties of any kind.
                        We do not guarantee uninterrupted access or error-free operation.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">8. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, My City Slow is not liable for indirect, incidental,
                        special, or consequential damages arising from use of the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">9. Changes to Terms</h2>
                    <p>
                        We may update these Terms & Conditions at any time. Updated terms will be posted on this page
                        with a revised "Last updated" date.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">10. Contact</h2>
                    <p>
                        If you have questions about these terms, contact us at
                        <span className="text-white font-semibold"> support@mycityslow.com</span>.
                    </p>
                </section>
            </div>
        </div>
    );
}
