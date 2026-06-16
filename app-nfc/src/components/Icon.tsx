/**
 * Icon set ported from design-prototype/icons.jsx.
 * Lucide-style, 1.5px stroke, colored via the `color` prop.
 */
import Svg, { Circle, Ellipse, G, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'bluetooth'
  | 'bluetooth-connected'
  | 'bluetooth-off'
  | 'contactless'
  | 'card'
  | 'audio-lines'
  | 'music'
  | 'activity'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'play'
  | 'pause'
  | 'stop'
  | 'sun'
  | 'moon'
  | 'x'
  | 'chevron-right'
  | 'chevron-left'
  | 'check'
  | 'refresh'
  | 'search'
  | 'upload'
  | 'alert'
  | 'loader'
  | 'unlink'
  | 'zap'
  | 'check-circle'
  | 'sliders'
  | 'cat'
  | 'drum'
  | 'bird'
  | 'sparkles'
  | 'car'
  | 'bell'
  | 'hand'
  | 'music-2'
  | 'radio'
  | 'ticket'
  | 'settings'
  | 'nfc'
  | 'square'
  | 'check-circle-2'
  | 'alert-triangle'
  | 'signal'
  | 'wifi'
  | 'battery-full'
  | 'pencil';

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color, strokeWidth = 1.5 }: IconProps) {
  const stroke = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const filled = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: color,
  };

  switch (name) {
    case 'bluetooth':
      return (
        <Svg {...stroke}>
          <Path d="m7 7 10 10-5 5V2l5 5L7 17" />
        </Svg>
      );
    case 'bluetooth-connected':
      return (
        <Svg {...stroke}>
          <Path d="m7 7 10 10-5 5V2l5 5L7 17" />
          <Line x1={18} y1={12} x2={21.5} y2={12} />
          <Line x1={2.5} y1={12} x2={6} y2={12} />
        </Svg>
      );
    case 'bluetooth-off':
      return (
        <Svg {...stroke}>
          <Path d="m17 17-5 5V12l-5 5" />
          <Path d="M14.5 9.5 17 7l-5-5v4.5" />
          <Line x1={3} y1={3} x2={21} y2={21} />
        </Svg>
      );
    case 'contactless':
      return (
        <Svg {...stroke}>
          <Path d="M8.5 16.5a5 5 0 0 0 0-9" />
          <Path d="M5.5 19.5a9 9 0 0 0 0-15" />
          <Path d="M2.5 22.5a13 13 0 0 0 0-21" />
        </Svg>
      );
    case 'card':
      return (
        <Svg {...stroke}>
          <Rect x={2.5} y={5} width={19} height={14} rx={2.5} />
          <Line x1={2.5} y1={9.5} x2={21.5} y2={9.5} />
          <Line x1={6} y1={14.5} x2={10} y2={14.5} />
        </Svg>
      );
    case 'audio-lines':
      return (
        <Svg {...stroke}>
          <Path d="M2 10v4" />
          <Path d="M6 6v12" />
          <Path d="M10 3v18" />
          <Path d="M14 8v8" />
          <Path d="M18 5v14" />
          <Path d="M22 10v4" />
        </Svg>
      );
    case 'music':
      return (
        <Svg {...stroke}>
          <Path d="M9 18V5l12-2v13" />
          <Circle cx={6} cy={18} r={3} />
          <Circle cx={18} cy={16} r={3} />
        </Svg>
      );
    case 'activity':
      return (
        <Svg {...stroke}>
          <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...stroke}>
          <Line x1={12} y1={5} x2={12} y2={19} />
          <Line x1={5} y1={12} x2={19} y2={12} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...stroke}>
          <Path d="M3 6h18" />
          <Path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
          <Path d="M18.5 6 17.8 19a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4L5.5 6" />
          <Line x1={10} y1={10.5} x2={10} y2={16.5} />
          <Line x1={14} y1={10.5} x2={14} y2={16.5} />
        </Svg>
      );
    case 'edit':
      return (
        <Svg {...stroke}>
          <Path d="M12 20h9" />
          <Path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </Svg>
      );
    case 'play':
      return (
        <Svg {...filled}>
          <Path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5Z" />
        </Svg>
      );
    case 'pause':
      return (
        <Svg {...filled}>
          <Rect x={6.5} y={5} width={3.6} height={14} rx={1} />
          <Rect x={13.9} y={5} width={3.6} height={14} rx={1} />
        </Svg>
      );
    case 'stop':
      return (
        <Svg {...filled}>
          <Rect x={6} y={6} width={12} height={12} rx={2} />
        </Svg>
      );
    case 'sun':
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={4} />
          <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </Svg>
      );
    case 'moon':
      return (
        <Svg {...stroke}>
          <Path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...stroke}>
          <Line x1={6} y1={6} x2={18} y2={18} />
          <Line x1={18} y1={6} x2={6} y2={18} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg {...stroke}>
          <Polyline points="9 6 15 12 9 18" />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg {...stroke}>
          <Polyline points="15 6 9 12 15 18" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...stroke}>
          <Polyline points="20 6 9 17 4 12" />
        </Svg>
      );
    case 'refresh':
      return (
        <Svg {...stroke}>
          <Path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <Polyline points="21 3 21 8 16 8" />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...stroke}>
          <Circle cx={11} cy={11} r={7} />
          <Line x1={21} y1={21} x2={16.5} y2={16.5} />
        </Svg>
      );
    case 'upload':
      return (
        <Svg {...stroke}>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <Polyline points="7 9 12 4 17 9" />
          <Line x1={12} y1={4} x2={12} y2={16} />
        </Svg>
      );
    case 'alert':
      return (
        <Svg {...stroke}>
          <Path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
          <Line x1={12} y1={9} x2={12} y2={13.5} />
          <Line x1={12} y1={17} x2={12.01} y2={17} />
        </Svg>
      );
    case 'loader':
      return (
        <Svg {...stroke}>
          <Path d="M12 3a9 9 0 1 0 9 9" />
        </Svg>
      );
    case 'unlink':
      return (
        <Svg {...stroke}>
          <Path d="m18.8 4 1.2 1.2a4 4 0 0 1 0 5.6L18 13" />
          <Path d="M6 11 4.2 12.8a4 4 0 0 0 0 5.6L5.4 19.6a4 4 0 0 0 5.6 0L13 17.4" />
          <Line x1={3} y1={3} x2={21} y2={21} />
        </Svg>
      );
    case 'zap':
      return (
        <Svg {...stroke}>
          <Path d="M13 2 4.5 13.5H11l-1 8.5L18.5 10H12l1-8Z" />
        </Svg>
      );
    case 'check-circle':
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={9} />
          <Polyline points="8.5 12 11 14.5 15.5 9.5" />
        </Svg>
      );
    case 'sliders':
      return (
        <Svg {...stroke}>
          <Line x1={21} y1={4} x2={14} y2={4} />
          <Line x1={10} y1={4} x2={3} y2={4} />
          <Line x1={21} y1={12} x2={12} y2={12} />
          <Line x1={8} y1={12} x2={3} y2={12} />
          <Line x1={21} y1={20} x2={16} y2={20} />
          <Line x1={12} y1={20} x2={3} y2={20} />
          <Line x1={14} y1={2} x2={14} y2={6} />
          <Line x1={8} y1={10} x2={8} y2={14} />
          <Line x1={16} y1={18} x2={16} y2={22} />
        </Svg>
      );
    case 'cat':
      return (
        <Svg {...stroke}>
          <Path d="M5.5 4l3.6 2.2-1 3.4z" fill={color} stroke="none" />
          <Path d="M18.5 4l-3.6 2.2 1 3.4z" fill={color} stroke="none" />
          <Circle cx={12} cy={13} r={6.4} />
          <Circle cx={9.8} cy={12} r={0.95} fill={color} stroke="none" />
          <Circle cx={14.2} cy={12} r={0.95} fill={color} stroke="none" />
          <Path d="M12 14v1.4M12 15.4l-1.2.9M12 15.4l1.2.9" />
          <Path d="M5.4 13.4l-2.4.3M5.4 14.7l-2.2 1M18.6 13.4l2.4.3M18.6 14.7l2.2 1" />
        </Svg>
      );
    case 'drum':
      return (
        <Svg {...stroke}>
          <Ellipse cx={12} cy={10} rx={7} ry={2.6} />
          <Path d="M5 10v4.5c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V10" />
          <Path d="M8.5 7.5L5 3M15.5 7.5L19 3" />
          <Circle cx={4.6} cy={2.7} r={1} fill={color} stroke="none" />
          <Circle cx={19.4} cy={2.7} r={1} fill={color} stroke="none" />
        </Svg>
      );
    case 'bird':
      return (
        <Svg {...stroke}>
          <Ellipse cx={11} cy={12.5} rx={5} ry={4} />
          <Circle cx={15.2} cy={9} r={2.5} />
          <Path d="M17.4 8.4l2.6-.5-2 1.9z" fill={color} stroke="none" />
          <Circle cx={15.4} cy={8.6} r={0.6} fill={color} stroke="none" />
          <Path d="M6 12.5L3.4 11l.4 2.6" />
          <Path d="M10 16.4v2.4M12.6 16.4v2.4" />
          <Path d="M8.8 11.6a3 3 0 0 0 4.2 1.6" />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg {...stroke}>
          <Path d="M12 3.4l1.7 4.3 4.3 1.7-4.3 1.7L12 15.4l-1.7-4.3L6 9.4l4.3-1.7z" fill={color} stroke="none" />
          <Path d="M18 14l.85 2 2 .85-2 .85L18 20l-.85-2-2-.85 2-.85z" fill={color} stroke="none" />
        </Svg>
      );
    case 'car':
      return (
        <Svg {...stroke}>
          <Path d="M3 14l1.6-4.6A2 2 0 0 1 6.5 8h11a2 2 0 0 1 1.9 1.4L21 14v3.5a.9.9 0 0 1-.9.9H18.6" />
          <Path d="M5.4 18.4H3.9a.9.9 0 0 1-.9-.9V14h18" />
          <Circle cx={7.5} cy={17.6} r={1.9} fill={color} stroke="none" />
          <Circle cx={16.5} cy={17.6} r={1.9} fill={color} stroke="none" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...stroke}>
          <Path d="M6 16a6 6 0 0 1 1.3-3.7L8 11V9a4 4 0 0 1 8 0v2l.7 1.3A6 6 0 0 1 18 16z" />
          <Path d="M5 16h14" />
          <Path d="M10.4 19a1.7 1.7 0 0 0 3.2 0" />
        </Svg>
      );
    case 'hand':
      return (
        <Svg {...stroke}>
          <Path d="M9 11.5V5.7a1.5 1.5 0 0 1 3 0V10.5" />
          <Path d="M12 10.5V4.7a1.5 1.5 0 0 1 3 0V11" />
          <Path d="M15 11V6.7a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6 6 6 0 0 1-5.2-3l-2.2-3.8a1.5 1.5 0 0 1 2.6-1.5L9.4 13" />
          <Path d="M9 11.5V8.5a1.5 1.5 0 0 0-3 0v3.5" />
        </Svg>
      );
    case 'music-2':
      return (
        <Svg {...stroke}>
          <Path d="M9 17.5V5l9-2v12.5" />
          <Circle cx={6.5} cy={17.5} r={2.5} />
          <Circle cx={15.5} cy={15.5} r={2.5} />
        </Svg>
      );
    case 'radio':
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={2.4} fill={color} stroke="none" />
          <Path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4" />
          <Path d="M5 5a9.5 9.5 0 0 0 0 14M19 19a9.5 9.5 0 0 0 0-14" />
        </Svg>
      );
    case 'ticket':
      return (
        <Svg {...stroke}>
          <Path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5a2 2 0 0 0 0 4A1.5 1.5 0 0 1 19.5 14h-15A1.5 1.5 0 0 1 3 12.5a2 2 0 0 0 0-4z" />
          <Path d="M14 7v7" strokeDasharray="1.6 2.2" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={3.2} />
          <Path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.1 5.1l2.1 2.1M16.8 16.8l2.1 2.1M18.9 5.1l-2.1 2.1M7.2 16.8l-2.1 2.1" />
        </Svg>
      );
    case 'nfc':
      return (
        <Svg {...stroke}>
          <Path d="M5 9a6 6 0 0 1 0 6" />
          <Path d="M9 6a11 11 0 0 1 0 12" />
          <Path d="M13 3.5a16 16 0 0 1 0 17" />
        </Svg>
      );
    case 'square':
      return (
        <Svg {...filled}>
          <Rect x={6} y={6} width={12} height={12} rx={2.5} />
        </Svg>
      );
    case 'check-circle-2':
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M8 12.5l2.6 2.6L16 9.5" />
        </Svg>
      );
    case 'alert-triangle':
      return (
        <Svg {...stroke}>
          <Path d="M12 3.6l9.2 15.4H2.8z" />
          <Path d="M12 9.5v4" />
          <Circle cx={12} cy={16.4} r={0.7} fill={color} stroke="none" />
        </Svg>
      );
    case 'signal':
      return (
        <Svg {...filled}>
          <G fill={color} stroke="none">
            <Rect x={3} y={14} width={3} height={6} rx={1} />
            <Rect x={8} y={10} width={3} height={10} rx={1} />
            <Rect x={13} y={6} width={3} height={14} rx={1} />
            <Rect x={18} y={3} width={3} height={17} rx={1} />
          </G>
        </Svg>
      );
    case 'wifi':
      return (
        <Svg {...stroke}>
          <Path d="M4.5 11.5a11 11 0 0 1 15 0" />
          <Path d="M8 15a6 6 0 0 1 8 0" />
          <Circle cx={12} cy={18.5} r={1.1} fill={color} stroke="none" />
        </Svg>
      );
    case 'battery-full':
      return (
        <Svg {...stroke}>
          <Rect x={2} y={8} width={16} height={8} rx={2.2} />
          <Path d="M20.5 11v2" />
          <Rect x={4} y={10} width={12} height={4} rx={1} fill={color} stroke="none" />
        </Svg>
      );
    case 'pencil':
      return (
        <Svg {...stroke}>
          <Path d="M4 20h4L18.3 9.7a2.1 2.1 0 0 0-3-3L5 17v3z" />
          <Path d="M13.5 6.5l3 3" />
        </Svg>
      );
    default:
      return (
        <Svg {...stroke}>
          <Circle cx={12} cy={12} r={9} />
        </Svg>
      );
  }
}
