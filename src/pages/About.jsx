import React from 'react';

const About = () => {
  return (
    <div style={containerStyle}>
      {/* INJECTED HOVER EFFECTS */}
      <style>{`
        .tech-tag {
          transition: all 0.3s ease;
          cursor: default;
        }
        .tech-tag:hover {
          background-color: #FFD700 !important;
          border-color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .info-card {
          transition: transform 0.3s ease;
        }
        .info-card:hover {
          transform: scale(1.01);
        }
      `}</style>

      {/* HEADER SECTION */}
      <header style={headerSection}>
        <h1 style={titleStyle}>SYSTEM_MANIFEST</h1>
        <p style={taglineStyle}>VERSION 2.0 // CORE_INFRASTRUCTURE</p>
      </header>

      <div style={gridStyle}>
        {/* DEVELOPER CARD */}
        <section className="info-card" style={cardStyleBlack}>
          <h2 style={sectionLabelYellow}>THE_ARCHITECT</h2>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={devName}>ARMAGHAN ALI</h3>
            <p style={devRole}>LEAD FULL-STACK DEVELOPER</p>
          </div>

          <div style={contactGrid}>
            <div style={contactItem}>
              <span style={labelStyle}>COMM_ID:</span>
              <span style={valueStyle}>+92 301 5256387</span>
            </div>
            <div style={contactItem}>
              <span style={labelStyle}>UPLINK_MAIL:</span>
              <span style={valueStyle}>armaghanali304@gmail.com</span>
            </div>
            <div style={contactItem}>
              <span style={labelStyle}>LOCATION:</span>
              <span style={valueStyle}>WAH CANTT, PK // GRID_051</span>
            </div>
          </div>
        </section>

        {/* TECH STACK CARD */}
        <section className="info-card" style={cardStyleGrey}>
          <h2 style={sectionLabelBlack}>CORE_TECHNOLOGY</h2>
          <div style={techGrid}>
            <div className="tech-tag" style={techTag}>REACT_JS</div>
            <div className="tech-tag" style={techTag}>VITE_ENGINE</div>
            <div className="tech-tag" style={techTag}>MONGODB_CLOUD</div>
            <div className="tech-tag" style={techTag}>CLOUDINARY_API</div>
            <div className="tech-tag" style={techTag}>NODE_JS</div>
            <div className="tech-tag" style={techTag}>VERCEL_HOST</div>
          </div>
          <p style={missionText}>
            ENGINEERED FOR SEAMLESS COMMERCE OPERATIONS. 
            HIGH-SPEED PERFORMANCE WITH INDUSTRIAL GRADE STABILITY.
          </p>
        </section>
      </div>
    </div>
  );
};

// --- STYLING OBJECTS ---

const containerStyle = {
  backgroundColor: '#FFFFFF',
  color: '#000',
  minHeight: '100vh',
  padding: '60px 8%',
  fontFamily: '"Courier New", Courier, monospace',
};

const headerSection = {
  marginBottom: '60px',
  borderLeft: '10px solid #FFD700',
  paddingLeft: '30px',
};

const titleStyle = {
  fontSize: '3.5rem',
  fontWeight: '900',
  letterSpacing: '5px',
  margin: '0',
  color: '#000',
};

const taglineStyle = {
  color: '#888',
  letterSpacing: '2px',
  fontSize: '0.9rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '40px',
};

const cardStyleBlack = {
  backgroundColor: '#000',
  color: '#fff',
  padding: '40px',
  border: '1px solid #000',
  borderTop: '8px solid #FFD700',
};

const cardStyleGrey = {
  backgroundColor: '#f9f9f9',
  color: '#000',
  padding: '40px',
  border: '1px solid #eee',
  borderTop: '8px solid #000',
};

const sectionLabelYellow = {
  color: '#FFD700',
  fontSize: '0.8rem',
  letterSpacing: '3px',
  marginBottom: '30px',
  textDecoration: 'underline',
};

const sectionLabelBlack = {
  color: '#000',
  fontSize: '0.8rem',
  letterSpacing: '3px',
  marginBottom: '30px',
  textDecoration: 'underline',
};

const devName = {
  fontSize: '2rem',
  fontWeight: '900',
  margin: '0',
};

const devRole = {
  color: '#FFD700',
  fontSize: '0.7rem',
  letterSpacing: '2px',
  marginBottom: '0px',
};

const contactGrid = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const contactItem = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontSize: '0.6rem',
  color: '#666',
  fontWeight: 'bold',
};

const valueStyle = {
  fontSize: '1rem',
  color: '#fff',
};

const techGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
  marginBottom: '40px',
};

const techTag = {
  border: '2px solid #000',
  padding: '12px',
  textAlign: 'center',
  fontSize: '0.7rem',
  backgroundColor: '#fff',
  color: '#000',
  fontWeight: '900',
};

const missionText = {
  fontSize: '0.8rem',
  color: '#444',
  lineHeight: '1.6',
  fontFamily: 'sans-serif',
};

export default About;