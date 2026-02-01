# CameraController - Especificação de Requisitos

## Visão Geral

O **CameraController** é um componente React Native que agrupa controles de funcionalidades da câmera em uma barra horizontal. Permite ao usuário ligar/desligar e ajustar configurações como flash, angulação, zoom, HDR, foco, exposição e white balance.

## Requisitos Funcionais

### RF-01: Controle de Flash

- Toggle para ligar/desligar flash
- Estados: off, on, auto
- Ícone visual indicando estado atual
- Callback `onFlashChange(mode: 'off' | 'on' | 'auto')`

### RF-02: Controle de Angulação

- Toggle para mostrar/ocultar indicador AngleLine
- Integração com componente AngleLine existente
- Callback `onAngleLineToggle(enabled: boolean)`

### RF-03: Controle de Zoom

- Slider horizontal para ajuste de zoom
- Range configurável (ex: 1x a 10x)
- Exibição do valor atual
- Callback `onZoomChange(zoomLevel: number)`

### RF-04: Controle de HDR

- Toggle para ligar/desligar modo HDR
- Callback `onHDRChange(enabled: boolean)`

### RF-05: Controle de Foco

- Toggle entre foco automático e manual
- Quando manual: slider de ajuste
- Callback `onFocusChange(mode: 'auto' | 'manual', value?: number)`

### RF-06: Controle de Exposição

- Slider para ajuste de exposição
- Range: -2 a +2 EV
- Callback `onExposureChange(value: number)`

### RF-07: Controle de White Balance

- Seletor de presets: auto, daylight, cloudy, tungsten, fluorescent
- Callback `onWhiteBalanceChange(preset: WhiteBalancePreset)`

## Requisitos Não-Funcionais

### RNF-01: Performance

- Animações a 60fps usando react-native-reanimated
- Sem jank ou frame drops durante interações
- Lazy loading de controles não visíveis

### RNF-02: Responsividade

- Adaptar layout para diferentes tamanhos de tela
- Suportar orientação portrait e landscape

### RNF-03: Extensibilidade

- Arquitetura que permita adicionar novos controles facilmente
- Cada controle como componente independente

## Estado Interno

O componente gerenciará seu próprio estado interno:

```typescript
interface CameraControllerState {
  flash: 'off' | 'on' | 'auto';
  angleLineEnabled: boolean;
  zoom: number;
  hdrEnabled: boolean;
  focusMode: 'auto' | 'manual';
  focusValue: number;
  exposure: number;
  whiteBalance: WhiteBalancePreset;
  expandedControl: string | null; // qual controle está expandido
}
```

## Layout Visual

```
┌─────────────────────────────────────────────────────────────┐
│  [⚡] [📐] [🔍] [HDR] [◎] [☀️] [WB]                          │
└─────────────────────────────────────────────────────────────┘
       ↑
       └── Ao tocar, expande slider/opções abaixo do ícone
```

- Barra horizontal fixa na parte inferior
- Ícones touch com feedback visual
- Expansão animada para controles com slider/opções

## Dependências

- react-native-reanimated (já instalado)
- react-native-gesture-handler (para gestos)
- Componente AngleLine existente

## Critérios de Aceite

- [ ] Todos os 7 controles funcionando
- [ ] Animações fluidas sem jank
- [ ] Estado interno sincronizado com callbacks
- [ ] Testes unitários com 80%+ cobertura
- [ ] Funciona em iOS e Android
- [ ] Documentação de uso no README
