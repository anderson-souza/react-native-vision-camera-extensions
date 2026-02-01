# CameraController - Design de Arquitetura

## Estrutura de Arquivos

```
src/components/CameraController/
├── index.ts                    # Export público
├── CameraController.tsx        # Componente principal
├── types.ts                    # Tipos e interfaces
├── constants.ts                # Valores default
├── styles.ts                   # Estilos base
├── useCameraController.ts      # Hook de estado interno
├── icons/                      # Ícones SVG
│   ├── index.ts
│   ├── FlashIcon.tsx
│   ├── AngleIcon.tsx
│   ├── ZoomIcon.tsx
│   ├── HdrIcon.tsx
│   ├── FocusIcon.tsx
│   ├── ExposureIcon.tsx
│   └── WhiteBalanceIcon.tsx
└── controls/                   # Componentes de controle
    ├── index.ts
    ├── ControlButton.tsx       # Botão base reutilizável
    ├── ControlSlider.tsx       # Slider base reutilizável
    ├── FlashControl.tsx
    ├── AngleLineControl.tsx
    ├── ZoomControl.tsx
    ├── HdrControl.tsx
    ├── FocusControl.tsx
    ├── ExposureControl.tsx
    └── WhiteBalanceControl.tsx
```

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                      CameraController                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 useCameraController                      │    │
│  │  - state: CameraControllerState                         │    │
│  │  - dispatch: (action) => void                           │    │
│  │  - expandControl: (name) => void                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────┼───────────────────────────────┐  │
│  │         ControlBar (Barra Horizontal)                     │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │  │
│  │  │Flash│ │Angle│ │Zoom │ │ HDR │ │Focus│ │Expo │ │ WB  │ │  │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ │  │
│  └─────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┘  │
│        │       │       │       │       │       │       │        │
│  ┌─────┴───────┴───────┴───────┴───────┴───────┴───────┴─────┐  │
│  │              ExpandedPanel (Animado)                       │  │
│  │  - Mostra slider/opções do controle expandido             │  │
│  │  - Animação de entrada/saída com Reanimated               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Interfaces Principais

```typescript
// types.ts

export type FlashMode = 'off' | 'on' | 'auto';
export type FocusMode = 'auto' | 'manual';
export type WhiteBalancePreset =
  | 'auto'
  | 'daylight'
  | 'cloudy'
  | 'tungsten'
  | 'fluorescent';

export type ControlName =
  | 'flash'
  | 'angleLine'
  | 'zoom'
  | 'hdr'
  | 'focus'
  | 'exposure'
  | 'whiteBalance';

export interface CameraControllerState {
  flash: FlashMode;
  angleLineEnabled: boolean;
  zoom: number;
  hdrEnabled: boolean;
  focusMode: FocusMode;
  focusValue: number;
  exposure: number;
  whiteBalance: WhiteBalancePreset;
  expandedControl: ControlName | null;
}

export interface CameraControllerProps {
  /** Quais controles exibir */
  controls?: ControlName[];

  /** Valores iniciais */
  initialState?: Partial<CameraControllerState>;

  /** Callbacks */
  onFlashChange?: (mode: FlashMode) => void;
  onAngleLineToggle?: (enabled: boolean) => void;
  onZoomChange?: (level: number) => void;
  onHDRChange?: (enabled: boolean) => void;
  onFocusChange?: (mode: FocusMode, value?: number) => void;
  onExposureChange?: (value: number) => void;
  onWhiteBalanceChange?: (preset: WhiteBalancePreset) => void;
  onStateChange?: (state: CameraControllerState) => void;

  /** Configuração de zoom */
  zoomRange?: { min: number; max: number };

  /** Configuração de exposição */
  exposureRange?: { min: number; max: number };

  /** Estilos */
  style?: ViewStyle;
  barStyle?: ViewStyle;
  iconColor?: string;
  activeIconColor?: string;
  backgroundColor?: string;
}
```

## Padrão de Estado: useReducer

```typescript
// useCameraController.ts

type Action =
  | { type: 'SET_FLASH'; payload: FlashMode }
  | { type: 'TOGGLE_ANGLE_LINE' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'TOGGLE_HDR' }
  | { type: 'SET_FOCUS_MODE'; payload: FocusMode }
  | { type: 'SET_FOCUS_VALUE'; payload: number }
  | { type: 'SET_EXPOSURE'; payload: number }
  | { type: 'SET_WHITE_BALANCE'; payload: WhiteBalancePreset }
  | { type: 'EXPAND_CONTROL'; payload: ControlName | null };

function reducer(state: CameraControllerState, action: Action): CameraControllerState {
  switch (action.type) {
    case 'SET_FLASH':
      return { ...state, flash: action.payload };
    case 'TOGGLE_ANGLE_LINE':
      return { ...state, angleLineEnabled: !state.angleLineEnabled };
    // ... outros cases
  }
}
```

## Animações

### Expansão de Painel
```typescript
// Usando Reanimated para animação de altura
const panelHeight = useSharedValue(0);
const panelStyle = useAnimatedStyle(() => ({
  height: withSpring(panelHeight.value, {
    damping: 15,
    stiffness: 150,
  }),
  opacity: withTiming(panelHeight.value > 0 ? 1 : 0),
}));
```

### Feedback de Toque
```typescript
// Escala no press
const scale = useSharedValue(1);
const buttonStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(scale.value) }],
}));

const handlePressIn = () => { scale.value = 0.9; };
const handlePressOut = () => { scale.value = 1; };
```

## Ícones SVG

Cada ícone será um componente funcional que recebe `color` e `size`:

```typescript
// icons/FlashIcon.tsx
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function FlashIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 2v11h3v9l7-12h-4l4-8z"
        fill={color}
      />
    </Svg>
  );
}
```

## Fluxo de Dados

```
User Tap → ControlButton → dispatch(action) → reducer → new state
                                                   ↓
                                             useEffect
                                                   ↓
                                           onXxxChange callback
```

## Dependências Adicionais

- `react-native-svg` - Para ícones SVG customizados
- `react-native-gesture-handler` - Já provavelmente instalado via Reanimated

## Considerações de Performance

1. **Memoização**: Cada ControlButton com `React.memo`
2. **Callbacks estáveis**: `useCallback` para handlers
3. **Animações worklet**: Toda animação roda na UI thread
4. **Lazy render**: Controles não visíveis não renderizam
