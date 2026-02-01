# CameraController - Tarefas de Implementação

## Legenda de Status

- [ ] Pendente
- [~] Em progresso
- [x] Concluído

## Fase A: Fundação (Setup)

### T1: Criar estrutura de diretórios

**Descrição**: Criar a estrutura de pastas para o componente
**Arquivos**:

- `src/components/CameraController/` (diretório)
- `src/components/CameraController/icons/` (diretório)
- `src/components/CameraController/controls/` (diretório)
  **Critério de aceite**: Diretórios existem
  **Status**: [ ]

### T2: Definir tipos e interfaces

**Descrição**: Criar arquivo de tipos com todas as interfaces
**Arquivos**:

- `src/components/CameraController/types.ts`
  **Dependências**: T1
  **Critério de aceite**: Tipos compilam sem erro
  **Status**: [ ]

### T3: Criar constantes e defaults

**Descrição**: Definir valores padrão para todas as configurações
**Arquivos**:

- `src/components/CameraController/constants.ts`
  **Dependências**: T2
  **Critério de aceite**: Constantes exportadas corretamente
  **Status**: [ ]

### T4: Criar estilos base

**Descrição**: Definir StyleSheet com estilos reutilizáveis
**Arquivos**:

- `src/components/CameraController/styles.ts`
  **Dependências**: T1
  **Critério de aceite**: Estilos para container, barra, botões
  **Status**: [ ]

---

## Fase B: Ícones SVG

### T5: Configurar react-native-svg

**Descrição**: Verificar/instalar dependência react-native-svg
**Comando**: `yarn add react-native-svg`
**Critério de aceite**: Import funciona sem erro
**Status**: [ ]

### T6: Criar FlashIcon

**Arquivos**: `src/components/CameraController/icons/FlashIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T7: Criar AngleIcon

**Arquivos**: `src/components/CameraController/icons/AngleIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T8: Criar ZoomIcon

**Arquivos**: `src/components/CameraController/icons/ZoomIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T9: Criar HdrIcon

**Arquivos**: `src/components/CameraController/icons/HdrIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T10: Criar FocusIcon

**Arquivos**: `src/components/CameraController/icons/FocusIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T11: Criar ExposureIcon

**Arquivos**: `src/components/CameraController/icons/ExposureIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T12: Criar WhiteBalanceIcon

**Arquivos**: `src/components/CameraController/icons/WhiteBalanceIcon.tsx`
**Props**: `size`, `color`
**Dependências**: T5
**Status**: [ ]

### T13: Criar index de ícones

**Arquivos**: `src/components/CameraController/icons/index.ts`
**Descrição**: Re-exportar todos os ícones
**Dependências**: T6-T12
**Status**: [ ]

---

## Fase C: Componentes Base

### T14: Criar ControlButton

**Descrição**: Botão base com animação de feedback
**Arquivos**: `src/components/CameraController/controls/ControlButton.tsx`
**Features**:

- Animação de escala no press (Reanimated)
- Suporte a ícone ativo/inativo
  **Dependências**: T4, T13
  **Status**: [ ]

### T15: Criar ControlSlider

**Descrição**: Slider base animado para controles de range
**Arquivos**: `src/components/CameraController/controls/ControlSlider.tsx`
**Features**:

- Range configurável (min/max)
- Label de valor atual
- Animação suave
  **Dependências**: T4
  **Status**: [ ]

### T16: Criar ExpandedPanel

**Descrição**: Container animado para conteúdo expandido
**Arquivos**: `src/components/CameraController/controls/ExpandedPanel.tsx`
**Features**:

- Animação de altura com withSpring
- Fade in/out
  **Dependências**: T4
  **Status**: [ ]

---

## Fase D: Controles Específicos

### T17: Criar FlashControl

**Descrição**: Controle de flash com 3 estados
**Arquivos**: `src/components/CameraController/controls/FlashControl.tsx`
**Features**:

- Cicla entre off → on → auto
- Ícone muda baseado no estado
  **Dependências**: T14, T6
  **Status**: [ ]

### T18: Criar AngleLineControl

**Descrição**: Toggle para mostrar/ocultar AngleLine
**Arquivos**: `src/components/CameraController/controls/AngleLineControl.tsx`
**Features**:

- Toggle simples on/off
  **Dependências**: T14, T7
  **Status**: [ ]

### T19: Criar ZoomControl

**Descrição**: Controle de zoom com slider
**Arquivos**: `src/components/CameraController/controls/ZoomControl.tsx`
**Features**:

- Expande para mostrar slider
- Exibe valor atual (1x, 2x, etc)
  **Dependências**: T14, T15, T16, T8
  **Status**: [ ]

### T20: Criar HdrControl

**Descrição**: Toggle para HDR
**Arquivos**: `src/components/CameraController/controls/HdrControl.tsx`
**Features**:

- Toggle simples on/off
  **Dependências**: T14, T9
  **Status**: [ ]

### T21: Criar FocusControl

**Descrição**: Controle de foco com modo + valor
**Arquivos**: `src/components/CameraController/controls/FocusControl.tsx`
**Features**:

- Toggle auto/manual
- Slider quando em modo manual
  **Dependências**: T14, T15, T16, T10
  **Status**: [ ]

### T22: Criar ExposureControl

**Descrição**: Controle de exposição com slider
**Arquivos**: `src/components/CameraController/controls/ExposureControl.tsx`
**Features**:

- Slider de -2 a +2 EV
- Exibe valor atual
  **Dependências**: T14, T15, T16, T11
  **Status**: [ ]

### T23: Criar WhiteBalanceControl

**Descrição**: Seletor de white balance
**Arquivos**: `src/components/CameraController/controls/WhiteBalanceControl.tsx`
**Features**:

- Expande para mostrar presets
- 5 opções: auto, daylight, cloudy, tungsten, fluorescent
  **Dependências**: T14, T16, T12
  **Status**: [ ]

### T24: Criar index de controls

**Arquivos**: `src/components/CameraController/controls/index.ts`
**Descrição**: Re-exportar todos os controles
**Dependências**: T17-T23
**Status**: [ ]

---

## Fase E: Hook de Estado

### T25: Criar useCameraController hook

**Descrição**: Hook com useReducer para gerenciar estado
**Arquivos**: `src/components/CameraController/useCameraController.ts`
**Features**:

- Reducer com todas as actions
- Integração com callbacks externos
- Estado inicial configurável
  **Dependências**: T2, T3
  **Status**: [ ]

---

## Fase F: Componente Principal

### T26: Criar CameraController

**Descrição**: Componente principal que orquestra tudo
**Arquivos**: `src/components/CameraController/CameraController.tsx`
**Features**:

- Renderiza barra horizontal
- Filtra controles baseado em prop `controls`
- Gerencia expansão de painéis
  **Dependências**: T24, T25
  **Status**: [ ]

### T27: Criar index do componente

**Arquivos**: `src/components/CameraController/index.ts`
**Descrição**: Export público do componente e tipos
**Dependências**: T26
**Status**: [ ]

### T28: Exportar no index principal

**Arquivos**: `src/index.tsx`
**Descrição**: Adicionar export do CameraController
**Dependências**: T27
**Status**: [ ]

---

## Fase G: Testes

### T29: Testes para useCameraController

**Arquivos**: `src/__tests__/useCameraController.test.ts`
**Cobertura**: Todas as actions do reducer
**Dependências**: T25
**Status**: [ ]

### T30: Testes para CameraController

**Arquivos**: `src/__tests__/CameraController.test.tsx`
**Cobertura**: Renderização, interações, callbacks
**Dependências**: T26
**Status**: [ ]

---

## Fase H: Documentação

### T31: Atualizar README

**Arquivos**: `README.md`
**Descrição**: Documentar uso do CameraController
**Dependências**: T28
**Status**: [ ]

---

## Ordem de Execução Recomendada

```
T1 → T2 → T3 → T4 → T5
                    ↓
              T6-T12 (paralelo)
                    ↓
                   T13
                    ↓
              T14, T15, T16 (paralelo)
                    ↓
              T17-T23 (paralelo)
                    ↓
                   T24
                    ↓
                   T25
                    ↓
              T26 → T27 → T28
                    ↓
              T29, T30 (paralelo)
                    ↓
                   T31
```

## Estimativa Total: 31 tarefas
