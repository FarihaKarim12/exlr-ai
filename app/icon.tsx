import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: 32, height: 32,
        background: '#6366f1',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <polygon
            points="8,2 8,10 11,10 6,18 6,10 9,10"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}