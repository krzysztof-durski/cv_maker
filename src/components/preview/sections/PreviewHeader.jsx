export default function PreviewHeader({ personal }) {
  const { name, phone, email, linkedin, github, location } = personal
  const contactParts = [phone, email, linkedin, github, location].filter(Boolean)

  return (
    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
      {name && (
        <div style={{ fontSize: '24pt', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '4px' }}>
          {name}
        </div>
      )}
      {contactParts.length > 0 && (
        <div style={{ fontSize: '10pt', color: '#000', lineHeight: '1.6', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 6px' }}>
          {contactParts.map((part, i) => (
            <span key={i} style={{ minWidth: 0, wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
              {part}{i < contactParts.length - 1 ? ' |' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
