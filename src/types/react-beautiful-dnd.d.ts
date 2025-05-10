declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  // DragDropContext
  export interface DragDropContextProps {
    onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
    onDragStart?: (initial: DragStart, provided: ResponderProvided) => void;
    onDragUpdate?: (initial: DragUpdate, provided: ResponderProvided) => void;
  }

  export interface ResponderProvided {
    announce: Announce;
  }

  export type Announce = (message: string) => void;

  export interface DragStart {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    mode: 'FLUID' | 'SNAP';
  }

  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation | null;
    combine?: Combine | null;
  }

  export interface DropResult extends DragUpdate {
    reason: DropReason;
  }

  export type DropReason = 'DROP' | 'CANCEL';

  export interface Combine {
    draggableId: string;
    droppableId: string;
  }

  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }

  export const DragDropContext: React.ComponentClass<DragDropContextProps>;

  // Droppable
  export interface DroppableProps {
    droppableId: string;
    type?: string;
    isDropDisabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    ignoreContainerClipping?: boolean;
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactElement<any>;
  }

  export interface DroppableProvided {
    innerRef: React.Ref<any>;
    droppableProps: {
      'data-rbd-droppable-context-id': string;
      'data-rbd-droppable-id': string;
    };
    placeholder?: React.ReactElement<any> | null;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
  }

  export const Droppable: React.ComponentClass<DroppableProps>;

  // Draggable
  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot,
      rubric: DraggableRubric
    ) => React.ReactElement<any>;
  }

  export interface DraggableProvided {
    innerRef: React.Ref<any>;
    draggableProps: {
      'data-rbd-draggable-context-id': string;
      'data-rbd-draggable-id': string;
      style?: React.CSSProperties;
      onTransitionEnd?: any;
    };
    dragHandleProps?: {
      'data-rbd-drag-handle-draggable-id': string;
      'data-rbd-drag-handle-context-id': string;
      'aria-labelledby': string;
      tabIndex: number;
      draggable: boolean;
      onDragStart: React.DragEventHandler<any>;
    };
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    };
    draggingOver?: string;
    combineWith?: string;
    combineTargetFor?: string;
    mode?: string;
  }

  export interface DraggableRubric {
    draggableId: string;
    type: string;
    source: DraggableLocation;
  }

  export const Draggable: React.ComponentClass<DraggableProps>;
}
