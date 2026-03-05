import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#8B1A1A',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF8F0',
          fontSize: 22,
          fontWeight: 'bold',
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
