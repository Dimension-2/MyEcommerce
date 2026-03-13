import React from 'react';

export default function Footer({ sidebarOpen }) {
    // Dynamic margin logic to prevent sidebar overlap
    const dynamicMargin = sidebarOpen === undefined ? '0px' : (sidebarOpen ? '260px' : '80px');

    return (
        <footer style={{ 
            ...styles.footerStyle, 
            marginLeft: dynamicMargin,
            transition: 'margin 0.3s ease' 
        }}>
            <style>{`
                .tech-badge-item {
                    transition: all 0.3s ease;
                    cursor: default;
                }
                .tech-badge-item:hover {
                    background-color: #FFD700 !important;
                    color: #111 !important;
                    border-color: #FFD700 !important;
                    transform: translateY(-3px);
                }
            `}</style>

            <div style={styles.footerContainer}>
                
                {/* Column 1: Logo & Slogan */}
                <div style={styles.columnStyle}>
                    <h2 style={styles.logoStyle}>MY<span style={{color: '#FFD700'}}>STORE</span></h2>
                    <p style={styles.sloganStyle}>PREMIUM 2026 COLLECTION</p>
                    <div style={styles.versionBadge}>v2.4.0 STABLE</div>
                </div>

                {/* Column 2: Navigation */}
                <div style={styles.columnStyle}>
                    <h4 style={styles.headingStyle}>NAVIGATION</h4>
                    <ul style={styles.listStyle}>
                        <li><a href="/" style={styles.linkStyle}>HOME PAGE</a></li>
                        <li><a href="/products" style={styles.linkStyle}>SHOP FRONT</a></li>
                        <li><a href="/admin" style={styles.linkActiveStyle}>ADMIN PANEL</a></li>
                    </ul>
                </div>

                {/* Column 3: System Status */}
                <div style={styles.columnStyle}>
                    <h4 style={styles.headingStyle}>SYSTEM STATUS</h4>
                    <ul style={styles.listStyle}>
                        <li style={styles.statusItem}><span style={styles.dot}></span> DATABASE LIVE</li>
                        <li style={styles.statusItem}><span style={styles.dot}></span> API CONNECTED</li>
                        <li style={styles.statusItem}><span style={styles.dot}></span> SSL SECURED</li>
                    </ul>
                </div>

                {/* Column 4: Resources */}
                <div style={styles.columnStyle}>
                    <h4 style={styles.headingStyle}>RESOURCES</h4>
                    <ul style={styles.listStyle}>
                        <li style={styles.textItemStyle}>DOCUMENTATION</li>
                        <li style={styles.textItemStyle}>SYSTEM LOGS</li>
                        <li style={styles.textItemStyle}>MEDIA LIBRARY</li>
                    </ul>
                </div>

                {/* Column 5: Contact */}
                <div style={styles.columnStyle}>
                    <h4 style={styles.headingStyle}>CONTACT US</h4>
                    <div style={styles.contactBox}>
                        <p style={styles.contactText}>+92 301 5256387</p>
                        <p style={styles.contactText}>armaghanali2304@gmail.com</p>
                        <p style={styles.contactText}>PAKISTAN, ASIA</p>
                    </div>
                </div>
            </div>

            <hr style={styles.separatorStyle} />

            <div style={styles.bottomSection}>
                <div style={styles.badgeContainer}>
                    {['REACT.JS', 'NODE.JS', 'MONGODB', 'EXPRESS', 'JWT AUTH'].map((tech) => (
                        <span key={tech} className="tech-badge-item" style={styles.techBadge}>{tech}</span>
                    ))}
                </div>
                <p style={styles.copyrightStyle}>© COPYRIGHT 2026. DESIGNED & DEVELOPED BY ARMAGHAN ALI.</p>
            </div>
        </footer>
    );
}

const styles = {
    footerStyle: {
        background: '#111',
        color: '#ffffff',
        padding: '80px 40px 40px 40px',
        marginTop: '0px',
        fontFamily: "inherit",
        borderTop: '5px solid #FFD700',
    },
    footerContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    columnStyle: { display: 'flex', flexDirection: 'column', gap: '15px' },
    logoStyle: { fontSize: '1.4rem', fontWeight: '900', margin: 0, letterSpacing: '4px' },
    sloganStyle: { fontSize: '0.6rem', color: '#666', letterSpacing: '2px', fontWeight: '900' },
    versionBadge: { fontSize: '0.55rem', background: '#222', color: '#FFD700', padding: '5px 10px', borderRadius: '0px', width: 'fit-content', fontWeight: '900', letterSpacing: '1px' },
    headingStyle: { fontSize: '0.75rem', color: '#fff', fontWeight: '900', marginBottom: '10px', letterSpacing: '2px' },
    listStyle: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' },
    linkStyle: { color: '#888', textDecoration: 'none', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' },
    linkActiveStyle: { color: '#FFD700', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' },
    textItemStyle: { color: '#888', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' },
    statusItem: { color: '#fff', fontSize: '0.6rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '1px' },
    dot: { width: '8px', height: '2px', background: '#FFD700' }, 
    contactBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
    contactText: { margin: 0, fontSize: '0.65rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' },
    separatorStyle: { border: 'none', borderTop: '1px solid #222', margin: '50px 0' },
    bottomSection: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '30px' },
    badgeContainer: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' },
    techBadge: { fontSize: '0.6rem', fontWeight: '900', color: '#555', border: '1px solid #333', padding: '6px 15px', borderRadius: '0px', letterSpacing: '2px', display: 'inline-block' },
    copyrightStyle: { fontSize: '0.6rem', color: '#444', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }
};