import React, { forwardRef } from 'react'

const Certificate = forwardRef(({ userName, courseTitle, completionDate, certificateId }, ref) => {
  const formattedDate = new Date(completionDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Styles de base pour éviter les problèmes html2canvas
  const baseTextStyle = {
    letterSpacing: 'normal',
    wordSpacing: 'normal',
    whiteSpace: 'pre-wrap'
  }

  return (
    <div
      ref={ref}
      style={{
        width: '1123px',
        height: '794px',
        background: '#f8f9fa',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '0',
        margin: '0'
      }}
    >
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.8) 100%)',
        zIndex: 0
      }} />

      {/* Decorative Corner - Top Left */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '25px',
        width: '80px',
        height: '80px',
        borderTop: '5px solid #03045E',
        borderLeft: '5px solid #03045E',
        zIndex: 2
      }} />
      
      {/* Decorative Corner - Top Right */}
      <div style={{
        position: 'absolute',
        top: '25px',
        right: '25px',
        width: '80px',
        height: '80px',
        borderTop: '5px solid #03045E',
        borderRight: '5px solid #03045E',
        zIndex: 2
      }} />
      
      {/* Decorative Corner - Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '25px',
        width: '80px',
        height: '80px',
        borderBottom: '5px solid #03045E',
        borderLeft: '5px solid #03045E',
        zIndex: 2
      }} />
      
      {/* Decorative Corner - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        right: '25px',
        width: '80px',
        height: '80px',
        borderBottom: '5px solid #03045E',
        borderRight: '5px solid #03045E',
        zIndex: 2
      }} />

      {/* Green Inner Border */}
      <div style={{
        position: 'absolute',
        top: '45px',
        left: '45px',
        right: '45px',
        bottom: '45px',
        border: '3px solid #03EF62',
        borderRadius: '10px',
        zIndex: 1
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '70px 100px',
        boxSizing: 'border-box'
      }}>
        
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '55px',
            height: '55px',
            backgroundColor: '#03045E',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '30px', 
              fontWeight: 'bold',
              ...baseTextStyle
            }}>A</span>
          </div>
          <div>
            <div style={{ 
              fontSize: '26px', 
              fontWeight: 'bold', 
              color: '#03045E',
              lineHeight: '1.1',
              ...baseTextStyle
            }}>ALELO'IA</div>
            <div style={{ 
              fontSize: '12px', 
              color: '#03EF62', 
              fontWeight: 'bold',
              ...baseTextStyle
            }}>N A T R A</div>
          </div>
        </div>

        {/* Certificate Type */}
        <div style={{
          fontSize: '13px',
          color: '#666666',
          textTransform: 'uppercase',
          marginBottom: '8px',
          ...baseTextStyle
        }}>
          C E R T I F I C A T&nbsp;&nbsp;&nbsp;D E&nbsp;&nbsp;&nbsp;R É U S S I T E
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: '48px',
          color: '#03045E',
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontFamily: 'Georgia, serif',
          margin: '0 0 12px 0',
          ...baseTextStyle
        }}>
          Certificate of Completion
        </h1>

        {/* Decorative Line */}
        <div style={{
          width: '180px',
          height: '3px',
          backgroundColor: '#03EF62',
          marginBottom: '25px'
        }} />

        {/* Awarded To Text */}
        <p style={{
          fontSize: '17px',
          color: '#555555',
          margin: '0 0 20px 0',
          ...baseTextStyle
        }}>
          Ce certificat est décerné à
        </p>

        {/* User Name */}
        <div style={{
          fontSize: '40px',
          color: '#03045E',
          fontFamily: 'Georgia, serif',
          fontWeight: 'bold',
          marginBottom: '8px',
          paddingBottom: '8px',
          borderBottom: '3px solid #03EF62',
          paddingLeft: '30px',
          paddingRight: '30px',
          ...baseTextStyle
        }}>
          {userName || 'Nom de l\'apprenant'}
        </div>

        {/* For Completing Text */}
        <p style={{
          fontSize: '17px',
          color: '#555555',
          margin: '20px 0 15px 0',
          ...baseTextStyle
        }}>
          pour avoir complété avec succès le cours
        </p>

        {/* Course Title Box */}
        <div style={{
          fontSize: '26px',
          color: '#03045E',
          fontWeight: 'bold',
          padding: '12px 25px',
          backgroundColor: 'rgba(3, 239, 98, 0.12)',
          borderRadius: '8px',
          border: '2px solid rgba(3, 239, 98, 0.4)',
          marginBottom: '20px',
          ...baseTextStyle
        }}>
          « {courseTitle || 'Titre du cours'} »
        </div>

        {/* Date */}
        <p style={{
          fontSize: '15px',
          color: '#777777',
          margin: '0 0 25px 0',
          ...baseTextStyle
        }}>
          Délivré le {formattedDate}
        </p>

        {/* Signatures Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          maxWidth: '800px',
          marginTop: 'auto'
        }}>
          {/* Left Signature */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{
              width: '160px',
              height: '2px',
              backgroundColor: '#03045E',
              margin: '0 auto 6px auto'
            }} />
            <span style={{ 
              fontSize: '13px', 
              color: '#555555',
              ...baseTextStyle
            }}>Directeur Pédagogique</span>
          </div>

          {/* Seal */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '4px solid #03045E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#03045E',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                color: '#03EF62', 
                fontSize: '16px',
                lineHeight: '1',
                ...baseTextStyle
              }}>✓</span>
              <span style={{ 
                color: 'white', 
                fontSize: '10px', 
                fontWeight: 'bold',
                marginTop: '2px',
                ...baseTextStyle
              }}>CERTIFIÉ</span>
            </div>
          </div>

          {/* Right Signature */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{
              width: '160px',
              height: '2px',
              backgroundColor: '#03045E',
              margin: '0 auto 6px auto'
            }} />
            <span style={{ 
              fontSize: '13px', 
              color: '#555555',
              ...baseTextStyle
            }}>Responsable Formation</span>
          </div>
        </div>

        {/* Certificate ID */}
        <div style={{
          position: 'absolute',
          bottom: '55px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: '#999999',
          ...baseTextStyle
        }}>
          ID: {certificateId || 'CERT-' + Date.now()}
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-25deg)',
        fontSize: '100px',
        color: 'rgba(3, 239, 98, 0.04)',
        fontWeight: 'bold',
        pointerEvents: 'none',
        zIndex: 1,
        ...baseTextStyle
      }}>
        ALELO'IA
      </div>
    </div>
  )
})

Certificate.displayName = 'Certificate'

export default Certificate
